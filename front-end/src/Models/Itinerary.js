import Activity from "./Activity";

export default class Itinerary {
    constructor(id, tripName, startDate, endDate, description, image) {
        this.id = id;
        this.tripName = tripName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.image = image;

        this.activities = new Map(); // scheduled activities in the itinerary, mapped by ID

        this.stagedActivities = new Map(); // all activities including ones not yet optimized, mapped by ID
        // value field uses descriptors 'Added', 'Updated', 'Deleted', and 'none' to represent modification made (if any)
    }

    /**
     * Creates a new itinerary from scratch and adds the itinerary to the DB.
     * @param {*} tripName name of the trip
     * @param {*} startDate start date of the trip
     * @param {*} endDate end date of the trip
     * @param {*} description optional description of the trip
     * @param {*} image optional image to display with the trip
     * @returns an Itinerary instance
     */
    static async createNewItinerary(tripName, startDate, endDate, description, image) {
        const id = Date.now() + Math.floor(Math.random() * 1000)
        await fetch("/createItinerary", {
            method: 'POST',
            body: JSON.stringify({
                id,
                tripName,
                startDate,
                endDate,
                description,
                image
            })
        });

        return new Itinerary(tripName, startDate, endDate, description, image);
    }

    /**
     * Loads an existing itinerary from the DB.
     * @param {*} id the ID of the itinerary
     * @returns an Itinerary instance
     */
    static async loadItineraryFromDB(id) {
        const res = await fetch("/loadItinerary", {
            method: 'GET',
            body: JSON.stringify(id)
        });
        const data = await res.json();
        const itinerary = new Itinerary(data.id, data.tripName, data.startDate, data.endDate, data.description, data.image);
        data.activities.forEach(a => { // 'a' already in the format needed to create an Activity instance
            const newActivity = new Activity(a);
            const newStagedActivity = newActivity.clone(); // create a clone so the staged version doesn't modify the original
            itinerary.activities.set(a.id, newActivity);
            itinerary.stagedActivities.set(a.id, { change: 'none', newStagedActivity })
        });
    
        return itinerary;
    }

    addActivity(
        name,
        isHotelStay,
        location,
        duration,
        notes,
        proposedStartTime,
        proposedFinishTime
    ) {
        const newActivity = new Activity({
            name,
            isHotelStay,
            location,
            duration,
            notes,
            proposedStartTime,
            proposedFinishTime
        });

        this.stagedActivities.set(newActivity.id, { change: 'Added', activity: newActivity });
    }

    deleteActivity(activityId) {
        this.stagedActivities.set(
            activityId, 
            { 
                change: 'Deleted', 
                activity: this.stagedActivities.get(activityId).activity 
            }
        );
    }

    updateActivity(activityId, args) {
        const activityToUpdate = this.stagedActivities.get(activityId).activity;
        Object.keys(args).forEach(key => {
            if (activityToUpdate.has(key)) {
                activityToUpdate.set(key, args[key])
            }
        });
        this.stagedActivities.set(
            activityId,
            {
                change: 'Updated',
                activity: activityToUpdate
            }
        );
    }

    async optimizeRoute() {

        const activitiesToOptimize = this.stagedActivities.filter(a => a.change !== 'Deleted').map(a => a.activity);

        const jobs = [];

        // const firstStartTime = activitiesToOptimize[0]
        // const lastFinishTime = this.days[this.days.length - 1].lastFinishTime;

        // const tripStartLocation = this.days[0].startLocation;
        // const tripFinishLocation = this.days[this.days.length - 1].finishLocation;

        tripStartLocation

        const vehicle = {
            id: 1,
            start: [tripStartLocation.lon, tripStartLocation.lat],
            end: [tripFinishLocation.lon, tripFinishLocation.lat],
            // time_window: [firstStartTime, lastFinishTime]
        };

        // Iterate through each activity and structure it as an ORS "job"
        this.activities.forEach(activity => {
            const job = {
                id: activity.id,
                location: [activity.location.lon, activity.location.lat],
                service: activity.duration
            };
            if (activity.timeframes.length > 0) job.time_windows = activity.timeframes;
            jobs.push(job);
        });

        this.days.forEach((day, i) => {
            if (i + 1 < this.days.length) { // it is not the last day of the trip
                const nextDay = this.days[i + 1];
                const night = {
                    id: i + 1,
                    location: [day.finishLocation.lon, day.finishLocation.lat],
                    service: nextDay.timeframe.earliestStartTime - day.timeframe.earliestFinishTime
                };
                jobs.push(night);
            }
        });

        const req =
        {
            "jobs": jobs,
            "shipments": [],
            "vehicles": [vehicle],
            "options": {
                "g": true
            }
        }

        const response = await fetch('/optimization', {
            method: 'POST',
            body: JSON.stringify(req)
        });

        const data = await response.json();

        function getActivityById(id) {
            return this.activities.get(id);
        }

        // now assign activities to proper days
        const trip = data.routes[0];
        const steps = trip.steps;
        steps.forEach(step => {
            const { id, arrival, service } = step;

            if (id < 1000) { // This is a night at a hotel
                const dayNumber = id;
                const nightStay = {
                    id,
                    arrival,
                    service,
                    location: this.days[dayNumber].finishLocation
                };

                const scheduledNight = new ScheduledActivity(
                    nightStay,
                    this.days[dayNumber],
                    arrival,
                    arrival + service
                );
                this.proposedSchedule.push(scheduledNight);
            } else { // This is a regular activity
                const matchedActivity = getActivityById(id);
                if (matchedActivity) {
                    const dayNumber = this.#determineDay(arrival);
                    const scheduledDay = this.days[dayNumber];

                    const scheduledActivity = new ScheduledActivity(
                        matchedActivity,
                        scheduledDay,
                        arrival,
                        arrival + service
                    );
                    this.proposedSchedule.push(scheduledActivity);
                }
            }
        });


    }

    #determineDay(arrivalTime) {
        return this.days.findIndex(day =>
            arrivalTime >= day.timeframe.earliestStartTime &&
            arrivalTime <= day.timeframe.latestFinishTime
        ) + 1;
    }

    acceptOptimizedItinerary() {
        this.scheduledActivities = this.proposedSchedule.map(obj => [...obj.activity]);
        this.proposedSchedule = this; // reset the proposedSchedule
    }

    declineOptimizedItinerary() {
        this.proposedSchedule = []; // reset the proposedSchedule
    }

}
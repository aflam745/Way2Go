import Activity from "./Activity";

export default class Itinerary {
    constructor(id, tripName, startDate, endDate, startLocation, endLocation, transportation, description, image) {
        this.id = id;
        this.tripName = tripName;
        this.startDate = startDate; // earliest time activities can be scheduled
        this.endDate = endDate; // latest time activities can be scheduled
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.transportation = transportation;
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
     * @param {*} startLocation start location of the trip
     * @param {*} endLocation end location of the trip
     * @param {*} description optional description of the trip
     * @param {*} image optional image to display with the trip
     * @returns an Itinerary instance
     */
    static async createNewItinerary(tripName, startDate, endDate, startLocation, endLocation, transportation, description, image) {
        const id = Date.now() + Math.floor(Math.random() * 1000)
        await fetch("/createItinerary", {
            method: 'POST',
            body: JSON.stringify({
                id,
                tripName,
                startDate,
                endDate,
                startLocation,
                endLocation,
                transportation,
                description,
                image
            })
        });

        return new Itinerary(tripName, startDate, endDate, startLocation, endLocation, transportation, description, image);
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
        const itinerary = new Itinerary(
            data.id, 
            data.tripName, 
            data.startDate, 
            data.endDate, 
            data.startLocation,
            data.endLocation, 
            data.transportation,
            data.description, 
            data.image);
        data.activities.forEach(a => { // assume 'a' already in the format needed to create an Activity instance
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
        timeframes,
        notes
    ) {
        const newActivity = new Activity({
            name,
            isHotelStay,
            location,
            duration,
            timeframes,
            notes
        });

        this.stagedActivities.set(newActivity.id, { change: 'Added', activity: newActivity });
    }

    deleteActivity(activityId) {
        // do not immediately delete but rather mark as 'Deleted' so we can actually delete it once we run the optimization
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

        // filter out any activities that have been deleted and then get the raw activity
        const activitiesToOptimize = Array.from(this.stagedActivities.values()).filter(a => a.change !== 'Deleted').map(a => a.activity);

        const jobs = [];

        tripStartLocation = this.startLocation;
        tripEndLocation = this.endLocation;

        tripStartTime = this.startDate;
        tripEndTime = this.endDate;

        const vehicle = {
            id: 1,
            profile: this.transportation,
            start: [tripStartLocation.lon, tripStartLocation.lat],
            end: [tripEndLocation.lon, tripEndLocation.lat],
            time_window: [tripStartTime, tripEndTime]
        };

        // Iterate through each activity and structure it as an ORS "job"
        activitiesToOptimize.forEach(activity => {
            const job = {
                id: activity.id,
                location: [activity.location.lon, activity.location.lat],
                service: activity.duration
            };
            if (activity.timeframes.length > 0) job.time_windows = activity.timeframes;
            jobs.push(job);
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
        
        // Helper to calculate the day number relative to startDate
        const calculateDayNumber = timestamp => {
            return Math.floor((timestamp - this.startDate) / 86400) + 1;
        };

        const getActivityById = id => this.stagedActivities.get(id);

        const trip = data.routes[0];
        const steps = trip.steps;

        steps.forEach(step => {
            const { id, arrival, service, waiting_time: waitingTime } = step;

            const stagedActivity = getActivityById(id);
            const activity = stagedActivity.activity;

            activity.startTime = arrival + waitingTime;
            activity.finishTime = arrival + waitingTime + service;

            const startDay = calculateDayNumber(activity.startTime);
            const endDay = calculateDayNumber(activity.finishTime);

            activity.day = [startDay];

            // if it straddles midnight, also assign it to the next day
            if (endDay > startDay) {
                activity.day.push(endDay);
            }
        });

    }

    acceptOptimizedItinerary() {
        const newActivities = new Map();
        this.activities = this.stagedActivities.forEach((a, _) => {
            const activity = a.activity;
            const activityClone = activity.clone();
            this.newActivies.set(activityClone.id, activityClone);
        })
        this.activities = newActivities;
    }

    declineOptimizedItinerary() {    }

}
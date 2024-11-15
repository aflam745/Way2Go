import ScheduledActivity from "./Scheduling";

export default class Itinerary {
    constructor(tripName, scheduledActivities, days, timeframe) {
        this.tripName = tripName;
        this.timeframe = timeframe; // start and end dates of the trip
        this.days = days;

        this.activities = new Map(); // all definite activities in the itinerary, mapped by ID

        this.proposedActivities = new Map(); // activities that have been added but not yet accepted
    }

    addActivity(activity) {
        this.activities.set(activity.id, activity);
    }

    deleteActivity(activity) {
        this.activities.delete(activity.id);
        this.scheduledActivities = this.scheduledActivities.filter(a => a.id !== activity.id);
        this.proposedSchedule = this.proposedSchedule.filter(a => a.id !== activity.id);
    }


    async optimizeRoute2() {
        const jobs = [];

        const firstStartTime = this.days[0].timeframe.earliestStartTime;
        const lastFinishTime = this.days[this.days.length - 1].lastFinishTime;

        const tripStartLocation = this.days[0].startLocation;
        const tripFinishLocation = this.days[this.days.length - 1].finishLocation;

        const vehicle = {
            id: 1,
            start: [tripStartLocation.lon, tripStartLocation.lat],
            end: [tripFinishLocation.lon, tripFinishLocation.lat],
            time_window: [firstStartTime, lastFinishTime]
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
        this.scheduledActivities = [...this.proposedSchedule];
        this.proposedSchedule = []; // reset the proposedSchedule
    }

    declineOptimizedItinerary() {
        this.proposedSchedule = []; // reset the proposedSchedule
    }

}
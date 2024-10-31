export default class Itinerary {
    constructor(activities, days, timeframe) {
        this.activities = activities;
        this.timeframe = timeframe; // start and end dates of the trip

        // determined by running the optimization algorithm
        this.days = days; // array of Days that contain the activities to be done each day, initially null
    }

    /**
     * Calculates the optimized route for the itinerary.
     */
    async optimizeRoute() {
        const vehicles = this.days.map((day, i) => ({
            id: i,
            start: [day.startCoords.lon, day.startCoords.lat],
            end: [day.endCoords.lon, day.endCoords.lat],
            time_window: [day.startTime, day.finishTime]
        }))

        const jobs = this.activities.map(activity => ({
            id: activity.id,
            location: [activity.coordinates.lon, activity.coordinates.lat],
            service: activity.duration,
            skills: activity.daysCanBeScheduled,
            time_windows: activity.timeWindows
        }));


        const req =
        {
            "jobs": jobs,
            "shipments": [],
            "vehicles": vehicles,
            "options": {
                "g": true
            }
        }

        const response = await fetch('/optimization', {
            method: 'POST',
            body: JSON.stringify(req)
        })

        const data = await response.json();

        function getActivityById(id) {
            return this.activities.find(activity => activity.id = id);
        }

        // now assign activities to proper days
        data.routes.forEach(route => {
            const dayNumber = route.vehicle;
            const activitiesOnDay = dayNumber.steps;
            activitiesOnDay.forEach(activity => {
                const activityId = activity.id;
                const matchedActivity = getActivityById(activityId);

                // now push this to the correct day in the days array
                this.days[dayNumber].addActivity(matchedActivity);

                // set activity fields derived from optimization
                matchedActivity.scheduledArrivalTime = activity.arrival;
                matchedActivity.scheduledDepartureTime = activity.arrival + activity.service;
                matchedActivity.scheduledDay = dayNumber;
            });
        });


    }

}
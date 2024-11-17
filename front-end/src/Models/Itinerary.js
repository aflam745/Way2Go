import Activity from "./Activity";
import EventHub from "../eventhub/Event";

export default class Itinerary {
    constructor(id, tripName, startTime, endTime, startLocation, endLocation, transportation, description, image) {
        this.id = id;
        this.tripName = tripName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.transportation = transportation;
        this.description = description;
        this.image = image;

        this.activities = new Map(); // Aactivities in the itinerary, mapped by ID

        this.subscribeToEvents();
    }

    subscribeToEvents() {
        const hub = EventHub.getInstance();

        hub.subscribe(Events.NewActivity, activityData => {
            this.addActivity(activityData);
        });

        hub.subscribe(Events.DeleteActivity, activityId => {
            this.deleteActivity(activityId);
        });

        hub.subscribe(Events.EditActivity, activityData => {
            this.updateActivity(activityData.id, activityData);
        });
    }

    /**
     * Creates a new itinerary from scratch and adds the itinerary to the DB.
     */
    static async createNewItinerary(tripName, startTime, endTime, startLocation, endLocation, transportation, description, image) {
        const id = Date.now() + Math.floor(Math.random() * 1000);
        await fetch("/createItinerary", {
            method: "POST",
            body: JSON.stringify({
                id,
                tripName,
                startTime,
                endTime,
                startLocation,
                endLocation,
                transportation,
                description,
                image
            })
        });

        return new Itinerary(id, tripName, startTime, endTime, startLocation, endLocation, transportation, description, image);
    }

    /**
     * Loads an existing itinerary from the DB.
     */
    static async loadItineraryFromDB(id) {
        const res = await fetch("/loadItinerary", {
            method: "GET",
            body: JSON.stringify(id)
        });
        const data = await res.json();
        const itinerary = new Itinerary(
            data.id,
            data.tripName,
            data.startTime,
            data.endTime,
            data.startLocation,
            data.endLocation,
            data.transportation,
            data.description,
            data.image
        );
        data.activities.forEach((a) => {
            const newActivity = new Activity(a);
            itinerary.activities.set(a.id, newActivity);
        });

        return itinerary;
    }

    /**
     * Adds a new activity directly to the itinerary.
     */
    addActivity(name, isHotelStay, location, duration, timeframes, notes) {
        const newActivity = new Activity({
            name,
            isHotelStay,
            location,
            duration,
            timeframes,
            notes
        });

        this.activities.set(newActivity.id, newActivity);
        this.optimizeRoute();
    }

    /**
     * Deletes an activity by ID.
     */
    deleteActivity(activityId) {
        this.activities.delete(activityId);
        this.optimizeRoute();
    }

    /**
     * Updates an existing activity by ID.
     */
    updateActivity(activityId, args) {
        const activityToUpdate = this.activities.get(activityId);
        if (!activityToUpdate) {
            throw new Error(`Activity with ID ${activityId} not found.`);
        }

        Object.keys(args).forEach((key) => {
            if (key in activityToUpdate) {
                activityToUpdate[key] = args[key];
            }
        });

        this.optimizeRoute();
    }

    /**
     * Optimizes the route based on the current activities.
     */
    async optimizeRoute() {
        const activitiesToOptimize = Array.from(this.activities.values());

        const jobs = [];
        const vehicle = {
            id: 1,
            profile: this.transportation,
            start: [this.startLocation.lon, this.startLocation.lat],
            end: [this.endLocation.lon, this.endLocation.lat],
            time_window: [this.startTime, this.endTime]
        };

        activitiesToOptimize.forEach((activity) => {
            const job = {
                id: activity.id,
                location: [activity.location.lon, activity.location.lat],
                service: activity.duration
            };
            if (activity.timeframes.length > 0) job.time_windows = activity.timeframes;
            jobs.push(job);
        });

        const req = {
            jobs,
            shipments: [],
            vehicles: [vehicle],
            options: { g: true }
        };

        const response = await fetch("/optimization", {
            method: "POST",
            body: JSON.stringify(req)
        });

        const data = await response.json();

        const calculateDayNumber = (timestamp) => {
            return Math.floor((timestamp - this.startTime) / 86400) + 1;
        };

        const trip = data.routes[0];
        const steps = trip.steps;

        steps.forEach((step) => {
            const { id, arrival, service, waiting_time: waitingTime } = step;

            const activity = this.activities.get(id);
            if (!activity) return;

            activity.startTime = arrival + waitingTime;
            activity.finishTime = arrival + waitingTime + service;

            const startDay = calculateDayNumber(activity.startTime);
            const endDay = calculateDayNumber(activity.finishTime);

            activity.day = [startDay];

            if (endDay > startDay) {
                activity.day.push(endDay);
            }
        });
    }
}

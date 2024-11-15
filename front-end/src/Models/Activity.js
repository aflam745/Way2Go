export default class Activity {
    constructor(name, location, duration, notes) {
        this.id = Date.now() + Math.floor(Math.random() * 1000);
        this.name = name;
        this.location = location;
        this.duration = duration;
        this.notes = notes;
        this.timeframes = timeframes;

        // temp scheduling set once the optimization algorithm is run
        this.proposedScheduling = null;

        // set once a user accepts the optimized schedule
        this.scheduling = null;

        // // fields determined by optimization algorithm
        // this.scheduledArrivalTime = null;
        // this.scheduledDepartureTime = null;
        // this.scheduledDay = null;
    }



    // convertTimeToSeconds(time) {
    //     const [hours, minutes] = time.split(":").map(Number);
    //     return hours * 3600 + minutes * 60;
    // }
}

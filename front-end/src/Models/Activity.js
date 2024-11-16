export default class Activity {
    constructor ({
        name,
        isHotelStay,
        location,
        duration,
        notes,
        proposedStartTime = null,
        proposedFinishTime = null,
        scheduledStartTime = null,
        scheduledFinishTime = null,
        id = Date.now() + Math.floor(Math.random() * 1000)
    } = {}) {
        this.id = id;
        this.isHotelStay = isHotelStay;
        this.name = name;
        this.location = location;
        this.duration = duration;
        this.notes = notes;

        // Temporary scheduling set once the optimization algorithm is run
        this.proposedStartTime = proposedStartTime;
        this.proposedFinishTime = proposedFinishTime;

        // Set once a user accepts the optimized schedule
        this.scheduledStartTime = scheduledStartTime;
        this.scheduledFinishTime = scheduledFinishTime;
    }


    clone = () => new Activity({
        name: this.name,
        location: {...this.location},
        duration: this.duration,
        notes: this.notes,
        id: this.id,
        proposedStartTime: this.proposedStartTime,
        proposedFinishTime: this.proposedFinishTime,
        scheduledStartTime: this.scheduledStartTime,
        scheduledFinishTime: this.scheduledFinishTime
    })
}

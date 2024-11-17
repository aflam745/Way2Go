export default class Activity {
    constructor ({
        name,
        isHotelStay,
        location,
        duration,
        timeframes,
        day,
        notes,
        startTime,
        finishTime,
        id = Date.now() + Math.floor(Math.random() * 1000)
    } = {}) {
        this.id = id;
        this.isHotelStay = isHotelStay;
        this.name = name;
        this.location = location;
        this.duration = duration;
        this.timeframes = timeframes;
        this.day = day;
        this.notes = notes;
        this.startTime = startTime;
        this.finishTime = finishTime;
    }


    clone = () => new Activity({
        id: this.id,
        name: this.name,
        location: {...this.location},
        duration: this.duration,
        timeframes: this.timeframes,
        day: this.day,
        notes: this.notes,
        startTime: this.startTime,
        finishTime: this.finishTime
    })
}

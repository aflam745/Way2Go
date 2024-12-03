export default class Activity {
    constructor ({
        id = Date.now() + Math.floor(Math.random() * 1000),
        name,
        isHotelStay,
        location,
        duration,
        timeframes,
        day = [],
        notes,
        startTime,
        finishTime
    } = {}) {

        /** @type {number} */
        this.id = id;

        /** @type {boolean} */
        this.isHotelStay = isHotelStay;

        /** @type {string} */
        this.name = name;

        this.location = location;

        /** @type {string} */
        this.duration = duration;

        this.timeframes = timeframes;

        /** @type {Date} */
        this.day = day;

        /** @type {string} */
        this.notes = notes;

        /** @type {Date} */
        this.startTime = startTime;

        /** @type {Date} */
        this.finishTime = finishTime;
    }


    clone = () => new Activity({
        id: this.id,
        name: this.name,
        location: {...this.location},
        duration: this.duration,
        timeframes: [...this.timeframes],
        day: [...this.day],
        notes: this.notes,
        startTime: new Date(this.startTime.getTime()),
        finishTime: new Date(this.finishTime.getTime())
    })
}

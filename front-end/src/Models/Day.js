export default class Day {
    constructor(dayNumber, startCoords, endCoords, startAddress, finishAddress, startName, finishName, startTime, finishTime, transporation) {
        this.dayNumber = dayNumber;
        this.activities = []; // Array of Activity objects for this day
        this.startCoords = startCoords;
        this.endCoords = endCoords;
        this.startAddress = startAddress;
        this.finishAddress = finishAddress;
        this.startName = startName;
        this.finishName = finishName;
        this.startTime = startTime;
        this.finishTime = finishTime;
        this.transporation = transporation;


    }

    /**
     * Adds an activity to the day's schedule.
     * @param {*} activity 
     */
    addActivity(activity) {
        this.activities.push(activity);
    }
}
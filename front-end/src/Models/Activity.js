export default class Activity {
    constructor(id, name, coordinates, address, duration, notes, daysCanBeScheduled, timeWindows) {
        this.id = id;
        this.name = name;
        this.coordinates = coordinates;
        this.address = address;
        this.duration = duration;
        this.notes = notes;
        this.daysCanBeScheduled = daysCanBeScheduled; // array of the day numbers
        this.timeWindows = timeWindows.map(window => window.map(time => (this.convertTimeToSeconds(time)))); // flexible if length === 0
        this.flexibleTiming = flexibleTiming;
        this.mustOccurOnDay = mustOccurOnDay;

        // fields determined by optimization algorithm
        this.scheduledArrivalTime = null;
        this.scheduledDepartureTime = null;
        this.scheduledDay = null;
    }

    convertTimeToSeconds(time) {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 3600 + minutes * 60;
    }
}

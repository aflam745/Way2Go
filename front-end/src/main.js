import { ItineraryDetailsComponent } from "./components/ItineraryDetailsComponent/ItineraryDetailsComponent.js";

import Itinerary from "./Models/Itinerary.js";

const app = document.getElementById('app');

const details = {
    id: 12345,
    tripName: "France trip",
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 0, 3),
    startLocation: { lon: 0, lat: 0, address: "aaa" },
    endLocation: { lon: 0, lat: 0, address: "bbb" },
    transportation: "car",
    description: "this is an itinerary",
    image: "this will be an image",
}

const activities = [
    {
        id: 1,
        name: "Arrive in Paris",
        day: [1],
        location: {
            address: "Charles de Gaulle Airport, Paris",
            lat: 49.0097,
            lon: 2.5479
        },
        duration: "1 hour",
        startTime: "09:00 AM",
        endTime: "10:00 AM",
        description: "Arrival at Paris -> hotel."
    },
    {
        id: 2,
        name: "Eiffel Tower Visit",
        day: [1, 2],
        location: {
            address: "Champ de Mars, 5 Avenue Anatole",
            lat: 48.8584,
            lon: 2.2945
        },
        duration: "2 hours",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        description: ""
    },
    { 
        id: 3,
        name: "Notre-Dame Cathedral",
        day: [1, 2, 3],
        location: {
            address: "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris",
            lat: 48.8529,
            lon: 2.3500
        },
        duration: "2 hours",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        description: ""
    }
];

const mockItinerary = await Itinerary.createNewItinerary(...Object.values(details));

activities.forEach(activity => mockItinerary.activities.set(activity.id, activity));

const page = new ItineraryDetailsComponent(mockItinerary);
app.appendChild(page.render());

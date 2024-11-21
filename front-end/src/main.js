// import DirectionsComponent from "./components/DirectionsComponent/DirectionsComponent.js";

import { ItineraryComponent } from "./components/ItineraryComponent/ItineraryComponent.js";

import Itinerary from "./models/Itinerary.js";

const app = document.getElementById('app');

const mockItinerary = {
    tripName: "France trip",
    startDate: new Date(2025, 1, 1),
    endDate: new Date(2025, 1, 3),
    startLocation: { lon: 0, lat: 0, address: "aaa" },
    endLocation: { lon: 0, lat: 0, address: "bbb" },
    description: "this is an itinerary",
    transportation: "car",
    image: "this will be an image",
    activities: new Map([
        [1,  // Day 1 activities
            {
                name: "Arrive in Paris",
                day: [1],
                location: {
                    address: "Charles de Gaulle Airport, Paris",
                    latitude: 49.0097,
                    longitude: 2.5479
                },
                duration: "1 hour",
                startTime: "09:00 AM",
                endTime: "10:00 AM",
                description: "Arrival at Paris -> hotel."
            }
        ],
        [2,   // Day 2 activities
            {
                name: "Eiffel Tower Visit",
                day: [1, 2],
                location: {
                    address: "Champ de Mars, 5 Avenue Anatole",
                    latitude: 48.8584,
                    longitude: 2.2945
                },
                duration: "2 hours",
                startTime: "10:00 AM",
                endTime: "12:00 PM",
                description: ""
            },
        ],
        [3,   // Day 3 activities
            {
                name: "Notre-Dame Cathedral",
                day: [3],
                location: {
                    address: "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris",
                    latitude: 48.8529,
                    longitude: 2.3500
                },
                duration: "2 hours",
                startTime: "10:00 AM",
                endTime: "12:00 PM",
                description: ""
            }
        ]
    ])
};




const page = new ItineraryComponent(mockItinerary);
app.appendChild(page.render());


// Services
// const taskRepository = new DirectionsComponent();

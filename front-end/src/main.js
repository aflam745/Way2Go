import { ItineraryComponent } from "./components/ItineraryComponent/ItineraryComponent";

import { ActivityPageComponent } from "./components/ActivityPageComponent/ActivityPageComponent.js";
import DirectionsComponent from "./components/DirectionsComponent/DirectionsComponent.js";
import { RouterComponent } from "./components/RouterComponent/RouterComponent.js";

const app = document.getElementById('app');

const router = new RouterComponent(app)

router.render()

// Services
const itineraries = new ItineraryComponent();
app.appendChild(itineraries.render());

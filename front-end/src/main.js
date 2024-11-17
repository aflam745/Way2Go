import { ActivityPageComponent } from "./components/ActivityPageComponent/ActivityPageComponent.js";
import DirectionsComponent from "./components/DirectionsComponent/DirectionsComponent.js";
const app = document.getElementById('app');

const activityPage = new ActivityPageComponent();

app.appendChild(activityPage.render());

// Services
const taskRepository = new DirectionsComponent();

import { ActivityFormComponent } from "./components/ActivityFormComponent/ActivityFormComponent.js";
import { ActivityListComponent } from "./components/ActivityListComponent/ActivityListComponent.js";
import DirectionsComponent from "./components/DirectionsComponent/DirectionsComponent.js";
const app = document.getElementById('app');

const activityForm = new ActivityFormComponent();
const activityList = new ActivityListComponent();

app.appendChild(activityForm.render());
app.appendChild(activityList.render());

// Services
const taskRepository = new DirectionsComponent();

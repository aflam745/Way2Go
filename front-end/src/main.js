import { ActivityFormComponent } from "./components/ActivityFormComponent/ActivityFormComponent.js";
import { ActivityListComponent } from "./components/ActivityListComponent/ActivityListComponent.js";
const app = document.getElementById('app');

// Services
//const taskRepository = new TaskRepositoryService();

const activityForm = new ActivityFormComponent();
const activityList = new ActivityListComponent();

app.appendChild(activityForm.render());
app.appendChild(activityList.render());

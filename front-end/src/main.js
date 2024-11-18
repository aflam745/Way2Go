import { ItineraryComponent } from "./components/ItineraryComponent/ItineraryComponent";

const app = document.getElementById('app');

// Services
const itineraries = new ItineraryComponent();
const taskRepository = new TaskRepositoryService();
app.appendChild(itineraries.render());
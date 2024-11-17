import { ItineraryFormComponent } from "./components/ItineraryFormComponent/ItineraryFormComponent.js";

const app = document.getElementById('app');

const itineraryForm = new ItineraryFormComponent();

app.appendChild(itineraryForm.render());

import { ActivityPageComponent } from "./components/ActivityPageComponent/ActivityPageComponent.js";
import { RouterComponent } from "./components/RouterComponent/RouterComponent.js";
import { HomePageComponent } from './components/HomePageComponent/HomePageComponent.js'
import ItineraryPage from './components/ItineraryPage/ItineraryPage.js'

const app = document.getElementById('app');

const routes = new Map([
  ['/', new HomePageComponent()],
  ['/itinerary', new ItineraryPage()],
  ['/editItinerary', new ActivityPageComponent()]
])

const router = new RouterComponent(app, routes)


const homePageComponent = new HomePageComponent();

router.render(window.location);

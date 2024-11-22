import { ActivityPageComponent } from "./components/ActivityPageComponent/ActivityPageComponent.js";
import { RouterComponent } from "./components/RouterComponent/RouterComponent.js";
import { HomePageComponent } from './components/HomePageComponent/HomePageComponent.js'

const app = document.getElementById('app');

const routes = new Map([
  ['/', new HomePageComponent()]
])

const router = new RouterComponent(app, routes)

router.render(window.location)

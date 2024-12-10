import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { ItineraryFormComponent } from "../ItineraryFormComponent/ItineraryFormComponent.js";
import { constructURLFromPath, navigate, serializeQueryParams } from "../../lib/router.js";
import { ActivityDatabase } from "../../Models/ActivityDatabase.js";
import Itinerary from "../../Models/Itinerary.js";

export class HomePageComponent extends BaseComponent {
  #container = null;
  #formComponent = null;
  #itineraryDB = null;

  constructor() {
    super();
    this.loadCSS("HomePageComponent");
    this.#formComponent = new ItineraryFormComponent();
    this.#itineraryDB = new ActivityDatabase('ItineraryDB');
  }

  render() {
    this.#createContainer();
    this.#fetchAndDisplayItineraries();
    return this.#container;
  }

#createContainer() {
    this.#container = document.createElement("div");
    this.#container.classList.add("container");

    this.#addGoogleSignInButton();

    // Add the "plus" tile
    const addTile = document.createElement("div");
    addTile.classList.add("tile", "plus-tile");
    addTile.textContent = "+";
    addTile.onclick = () => this.#showForm();
    this.#container.appendChild(addTile);
}


  #showForm() {
    // Remove any existing form
    const existingForm = this.#container.querySelector(".itinerary-form");
    if (existingForm) existingForm.remove();

    // Render and append the form component to the container
    const formElement = this.#formComponent.render();
    this.#container.appendChild(formElement);

    // Attach event listener to the form submission
    formElement.querySelector("form").onsubmit = async (event) => {
      event.preventDefault(); // Prevent default form submission behavior

      const fd = new FormData(event.target)
      const locationEntries = this.#formComponent.getLocationEntries();

      const obj = Object.fromEntries(fd);
      obj["startLocation"] = locationEntries.startLocationEntry;
      obj["endLocation"] = locationEntries.endLocationEntry;

      const currentTime = Date.now();
      const randThreeDigitInt = (Math.floor((Math.random() * 900) + 100)).toString();
      const id = currentTime + randThreeDigitInt;
      const itineraryId = { id: id };

      obj["id"] = id;

      this.#addItineraryToIndexedDB({
        ...obj,
        ...itineraryId,
      });


      await Itinerary.saveItinerary(obj);
      this.#addItineraryTile(formElement.querySelector("#location").value);

      // Remove the form
      formElement.remove();

      const serializedParams = serializeQueryParams(itineraryId);
      const url = constructURLFromPath('/editItinerary', serializedParams);
      navigate(url);
    };
  }

  #addItineraryToIndexedDB(formData){
    this.#itineraryDB.addActivity(formData)
      .then((message) => {
        console.log(message);
      })
      .catch((error) => {
        console.error("Failed to add activity to ActivityDB:", error);
      });
  }

  #addItineraryTile(title) {
    // Create a new tile
    const newTile = document.createElement("div");
    newTile.classList.add("tile");
    newTile.textContent = title;

    // // Add navigation functionality to the tile
    // newTile.onclick = () => {
    //   // Update the URL without reloading the page
    //   const pageURL = `/activity/${encodeURIComponent(title)}`;
    //   history.pushState({}, "", pageURL);

    //   // Let the RouterComponent handle rendering the new page
    //   dispatchEvent(new PopStateEvent("popstate"));
    // };

    // Append the new tile to the container
    this.#container.appendChild(newTile);
  }

  async #fetchAndDisplayItineraries() {
    try {
      const itineraries = await this.#itineraryDB.getAllActivity();
      itineraries.forEach(data => {
        this.#addItineraryTile(data.location)
      });
    } catch (error) {
      console.error('failed to fetch itineraries from ItineraryDB:', error);
    }
  }
    #addGoogleSignInButton() {
    // Create the div to hold the Google Sign-In button
    const buttonDiv = document.createElement("div");
    buttonDiv.id = "buttonDiv"; // This is where the Google button will be rendered
    this.#container.appendChild(buttonDiv);

    // Load the Google Sign-In button script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      // Initialize Google Sign-In after the script is loaded
      google.accounts.id.initialize({
        client_id: "418418924635-kjfhcv4k4q69e7enevjtoimpert3kt9f.apps.googleusercontent.com",
        callback: this.#handleCredentialResponse
      });

      google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        {
          theme: "outline", // Customization attributes
          size: "large",
          type: "standard" 
        }
      );

      google.accounts.id.prompt(); // Show the One Tap prompt (optional)
    };
    // Append the script to load the Google Sign-In client
    document.body.appendChild(script);

    // Style the button container to position it in the top-right
    buttonDiv.style.position = "absolute";
    buttonDiv.style.top = "10px";
    buttonDiv.style.right = "10px";
  }

  // Handle the response from Google Sign-In
#handleCredentialResponse(response) {
  const id_token = response.credential;  // The JWT ID token received from Google

  // Send the token to the server for verification and authentication
  fetch('http://localhost:4000/auth/google/callback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_token }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('User authenticated successfully:', data.user);
      // Redirect or update UI based on successful authentication
    } else {
      console.error('Authentication failed:', data.message);
    }
  })
  .catch(error => {
    console.error('Error during authentication:', error);
  });
}
}

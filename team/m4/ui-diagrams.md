# UI Diagrams

## Home Page

Users can create itineraries from the home page by pressing the plus button. The home page will also show existing itineraries in cards where if a card is clicked, the corresponding itinerary will be shown in an Itinerary Display page.

![homePage](https://github.com/user-attachments/assets/1ba7bbed-f0e8-46ba-9554-8eb58327c375)

This screen is designed to be the central hub of the user’s experience, providing them with a high-level view of their created plans while also offering easy access to more detailed information. 

Use Case: 

A user who wants to view the itinerary for weekend plans they had made with friends last week clicks on the corresponding card. They are navigated to the Itinerary Display page. Once the activity has passed, they delete the plan from the homesecreen, and create a new one for next weekend.


## Create Itinerary Form

The Create Itinerary Page is designed to be simple and intuitive, allowing users to quickly input basic itinerary details to generate a new itinerary.

![createItineraryForm](https://github.com/user-attachments/assets/ef68415c-810b-483f-a446-b58b00f489b8)

When the user presses the plus button on the home page to create an itinerary, the user is presented with a form to enter the details of an itinerary including name, dates, timeframe, and description. Once they finalize the details and press create to submit the form, they are redirected to the home page where the newly created itinerary's is displayed among the other existing ones.

Use Case: 

A user who is visiting MA wants to create an itinerary. After clicking the plus button in the Home Page, they enter their plan's details. They press the create button which redirects them to the Home Page where there newly created itinerary is present.

## Itinerary Display

The Itinerary Display page shows users their created plan with an embedded viewport of a map. Beside the map is an order of activities that would take the least amount of time / most efficient way to travel and visit in organized by day which the user can select.

![itineraryDisplay](https://github.com/user-attachments/assets/99d7b143-15ac-4f2c-ad03-5cf9c10a1b31)

Once a user presses the card of an existing itinerary in the home page, they are redirected to the corresponding Itinerary Display page. Here, they are presented with a map on the left half of the screen which shows the routes of the activities. On the right half, they are presented with a dropdown listing all the activities' days to filter the activities by day. Once the user selects a day, that day's activities are displayed along with their details. If a user wants to update the activities, they can press the corresponding button in the top right of the page which opens the Edit Activities page. Otherwise, they can either save or delete the itinerary by pressing the corresponding buttons in the top right and left of the page respectively. Once a user saves or deletes, they are redirected to the home page where their change is reflected.

Use Case: 

A user just created a plan for visiting MA. However, they meant to input WPI instead of UMass Amherst as an address. So they press the edit activities button which redirects them to the Edit Activites page to change their inputs and regenerate a corrected itinerary. After doing so, they look at their new itinerary and view each day's activities to get an idea of the overall plan.


## Edit Activities

The Edit Activities page gives users the option to modify their activities by creating, editing, and deleting activities in a simple UI.

![editActivities](https://github.com/user-attachments/assets/6c786298-eab7-4dd1-977f-997045003389)

Once a user presses the edit activities button in the Itinerary Display page, they are redirected to the Edit Activities page. Here, on the left half of the page, they are presented with a form to create a new activity with details including if the activity has to be on a specific date, the name, address, duration, possible timeframe, and notes. They can press the Add Activity button to add the activity to the activity list on the right half of the page. Also in this activity list is the list of all existing activites where each activity has an edit and delete button where if the user chooses to edit, the data for that activity is populated in the form in the left half of the page to modify and save. Once the user is done, they can save by pressing the button in the top right which will redirect to the Itinerary Display page which will reflect their changes.

Use Case: 

A user just created a plan for visiting MA. However, they forgot to add Harvard as a destination. So they press the edit activities button which redirects them to the Edit Activites page to add a new activity of visiting Harvard. After doing so, they look at their new itinerary and view each day's activities to get an idea of the overall plan, where the Harvard activity is now present.

# Contribution Log for Andrew Flammia

### October 18, 2024

- **Tasks**: Set up the initial GitHub repository, project structure, and came up with idea for project.
- **Details**: Created the main repository and organized folders for `team/m2` and `reports`.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/pull/2/commits/78f5b9e7b0ba7779dced8c1ee06663f38e685938)

### October 21, 2024

- **Tasks**: Finished the `problem.md` file.
- **Details**: Wrote the problem description and proposed solution based on team brainstorming.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/pull/4/commits/2a2c92499024cb2265dcab1c1651a7f338469b12)

### October 25, 2024

- **Tasks**: Created an initial skeleton for the application.
- **Details**: Created an initial skeleton for the application creating the EventHub and some basic components.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/commit/8d0e8d3e4397b1c7b04e89324a0433f54763844b)

### November 04, 2024

- **Tasks**: Created basic activity form.
- **Details**: Created a basic form and activity list to enter and display activities.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/commit/67fc4d0b97b83f81086749563024942440737134)

### November 08, 2024

- **Tasks**: Build on activity form.
- **Details**: Gave activity item cards the ability to be expanded to show the details.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/commit/0b0d1d0c91f8fe885b6e9c151085c74c0b49fa58)

### November 17, 2024

- **Tasks**: Finalized Activity Form page.
- **Details**: Implemented IndexedDB to store entered activities and fully implemented edit and delete functionality on activities.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/pull/29/commits/04141b34f1dee70f556e70436bf5fd00a43a571b)

### November 21, 2024

- **Tasks**: Ability to clear the activity list.
- **Details**: Implemented function to clear all the activities from the activity list on the activity form page.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/commit/1f3046fde1f594fabcac6b4b442a8c7e35ca761f)

### December 3, 2024

- **Tasks**: Create routes for itinerary page and editItinerary page.
- **Details**: Implemented routes so user can navigate between the two pages as well as finished up adding the activity list cards to the itinerary page.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/commit/a0b2f4bdaafceab35dd45d0a2af9b4c413624ad7)

### December 4, 2024

- **Tasks**: Save created itineraries to indexedDB.
- **Details**: Implemented indexedDB on the home page so created itineraries are saved to indexedDB for local storage when page is reloaded.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/commit/9acd1fa55be4f79410644422b3d51f368a1e8daf)


### December 5, 2024

- **Tasks**: Pass query params to itinerary and editItinerary url.
- **Details**: Added the itinerary id as query params for the editItinerary url so have access to the parent itinerary and pass itinerary id to itinerary url as well.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/commit/13ac628dcd698be3391586e63b265089c5767f2e)

### December 10, 2024

- **Tasks**: Load itineraries in indexedDB to create tiles on home page.
- **Details**: Created function to fetch itineraries from indexedDB to load all the tiles onto the home page. As well as updated some styling.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/commit/410ea7c57decef33c76c89176b7aa53d8a863958)

### December 10, 2024

- **Tasks**: Delete activities from indexedDB when generate itinerary.
- **Details**: Created indexedDB function to delete all entries from indexedDB. Called the function when generate itinerary button is pressed.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/commit/181d7eff07f320c428e00f766e087e73c61b1cf8)

### December 10, 2024

- **Tasks**: Delete itineraries from indexedDB on home page.
- **Details**: Added button on each tile on home page to delete that itinerary from indexedDB. As well as made some styling changes.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/commit/1ecd7a1a8dae156f4922a2f997bc3fd076536e4a)

### December 10, 2024

- **Tasks**: Hide edit and delete buttons on activities.
- **Details**: Function to hide the delete and edit buttons for activities when on the itinerary page.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/commit/85a16823d78cba994ff3377c2a1573737c6b324f)

### December 10, 2024

- **Tasks**: Delete itineraries and activities from back-end database.
- **Details**: Wrote the sequelize functions to delete itineraries and activities from the back-end database given the id of each. When a itinerary is deleted all of its corresponding activities are also deleted. Wrote the express routes for deleting both itineraries and activities by passing each ones corresponding id to the route. Added the routes to the necessary places in the front end so when the delete button on an itinerary tile on the home page is pressed the delete route is triggered and the itinerary and all its corresponding activities in the back-end DB are deleted. Did not connect the delete activity route anywhere in the front end at the moment because not needed yet.
- **Link to Commit**: [Initial Commit](https://github.com/aflam745/CS326Team36Project/commit/13450d4a9afcb813e34354aee15a3c0682c35287)

# Application Data 

##  Overview

### 1. Activity

- **Description**: Contains details for a place the user would like to visit
- **Attributes**:
    - `activityId` (string): a way to uniquely identify an actitvity
    - `locationName` (string): the name of the activity
    - `coordinates` (object): an object containing the x- and y-coordinates of the location
    - `activityDuration` (float): the amount of time to be spent at an activity

### 2. Grouped Activities

- **Description**: A group of activities manually linked together by the user, overriding the most efficient route determined by the algorithm. This is useful in the instance where a user knows they want to have a fixed part of the schedule; for example, getting lunch at a specific restaurant directly after leaving a museum.
- **Attributes**:
    - `groupId` (string): a way to uniquely identify a group
    - `activities` (list): an ordered list of the activities grouped together
    - `groupDuration` (float): the total amount of time of the group activities, including travel time
    - `groupDistance` (float): total distance in miles or km of the group


### 3. Itinerary

- **Description**: Holds the list of activities (including any grouped activities) the user would like to visit
- **Attributes**:
    - `itineraryId` (string): a way to uniquely identify an itinerary; also used to access a specific itinerary/share with others
    - `activities` (list): a list of activities that comprise the itinerary
    - `itineraryDuration` (float): total time of the itinerary, taking into account travel times
    - `itineraryDistance` (float): total distance in miles or km of the trip
    - `roundTrip` (boolean): indicates if the itinerary should finish at the starting location
    - `ownerId` (string): ID of the user who owns this itinerary

### 4. User

- **Description**: Represents a user of the application
- **Attributes**:
    - `itinerariesOwned` (list): list of IDs of the itineraries that this user owns
    - `itinerariesHasAccess` (list): list of IDs of the itineraries that the user has access to but does not own
  

## Data Relationships

- **Itinerary to Activity Entry**: One-to-many relationship (an itinerary can have many activities).
- **Activities and itineraries to IDs**: One-to one (each activity or itinerary should have its own unique ID)

## Data Sources

- **User-Input Data**: 
    - Users will search for and input locations
    - Users will input a transportation method (walking, car, bike, etc.)
    - Users can also link certain activities in a specific order if they want to override the algorithm
- **System-Generated Data**: 
    - All IDs should be generated by the system
    - Official location names, coordinates, and directions are provided by the API
- **API**:
    - openrouteservice provides directions and an embeddable map, and this will be used to determine distances between points as well as displaying the optimal route on the map.
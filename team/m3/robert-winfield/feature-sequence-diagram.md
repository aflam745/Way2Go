## Itinerary Display Page Feature

The feature I chose was the **Itinerary Display Page** with Emmanuel.

- The page includes:
  - A map component to **visualize the itinerary**.
  - An **activity list** component that shows the activities by day specified via a dropdown
  - Buttons to save, edit, and delete activities


### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Map
    participant ActivityList

    User->>Map: Enter activity details
    User->>Map: Press "Add Activity" button
    Map->>ActivityList: Add new activity item
    ActivityList->>User: Display updated activity list

    User->>ActivityList: Press "Edit" on an activity
    ActivityList->>Map: Populate form with selected activity data
    User->>Map: Modify activity details
    User->>Map: Press "Add Activity" button
    Map->>ActivityList: Update activity item
    ActivityList->>User: Display updated activity list

    User->>ActivityList: Press "Delete" on an activity
    ActivityList->>User: Display updated activity list without deleted activity
```

## Activity Form Page Feature

The feature I chose was the **Activity Form Page**.

- The page includes:
  - A form component to **enter new activities**.
  - An **Activity List** container component that stores all the activities entered so far, allowing users to:
    - **Edit** activities
    - **Delete** activities

- Each activity entered is stored in **IndexedDB** for persistent data storage.

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant ActivityForm
    participant ActivityList
    participant IndexedDB

    User->>ActivityForm: Enter activity details
    User->>ActivityForm: Press "Add Activity" button
    ActivityForm->>ActivityList: Add new activity item
    ActivityForm->>IndexedDB: Store activity data
    ActivityList->>User: Display updated activity list

    User->>ActivityList: Press "Edit" on an activity
    ActivityList->>ActivityForm: Populate form with selected activity data
    User->>ActivityForm: Modify activity details
    User->>ActivityForm: Press "Add Activity" button
    ActivityForm->>ActivityList: Update activity item
    ActivityForm->>IndexedDB: Update activity data
    ActivityList->>User: Display updated activity list

    User->>ActivityList: Press "Delete" on an activity
    ActivityList->>IndexedDB: Delete activity data
    ActivityList->>User: Display updated activity list without deleted activity
```

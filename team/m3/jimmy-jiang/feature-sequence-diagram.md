sequenceDiagram
    participant User
    participant ItineraryForm
    participant ItineraryList
    participant IndexedDB

    User->>ItineraryForm: Enter itinerary details
    User->>ItineraryForm: Press "Create itinerary" button
    ItineraryForm->>ItineraryList: Add new itinerary item
    ItineraryForm->>IndexedDB: Store itinerary data
    ItineraryList->>User: Display updated itinerary list
# UI Diagrams

## Main Dashboard Screen

The Main Dashboard is the first screen users will see after logging into the application. The layout is designed to provide a quick overview of the user’s created plans, with a clean and simple interface that makes it easy to understand at a glance.

![dashboard](https://github.com/user-attachments/assets/99ec0e20-960d-4699-949d-aceb6ee4dd8e)

On this screen, users can interact with three main elements:

1. Logout Button: A logout button is present at the top right of the page for the user to log out of their session.
2. Plan Cards: Beneath the title, there is a list of cards corresponding to the plans the user has already created. Clicking on a card will open the details of its plan in the Plan Details Page.
3. Create New Plan Button: At the end of the plan cards is a plus button for users to create a new plan. Clicking on it will navigate to the Plan Creation Page.

This screen is designed to be the central hub of the user’s experience, providing them with a high-level view of their created plans while also offering easy access to more detailed information. 

Use Case: 

A user who wants to view the itinerary for weekend plans they had made with friends last week clicks on the corresponding card. They are navigated to the Plan Details Page. Once the activity has passed, they delete the plan from the homesecreen, and create a new one for next weekend.


## Plan Creation Page

The Plan Creation Page is designed to be simple and intuitive, allowing users to quickly input their starting point and desired destinations to generate a new plan.

![create](https://github.com/user-attachments/assets/5b4bf1b3-98fd-4731-8559-e88f894c828c)

The layout of the viewport is minimal, including only input text fields and a large button. The user has the option to add up to 5 stops using the plus button. Once the starting point and at least one stop is entered, the generate button becomes fuller with color to indicate that all fields are validated.

There is also a cancel button at the top left of the screen which directs users back to the Main Dashboard Screen without saving the plan being created.

Use Case: 

A user who is visiting MA wants to create an itinerary. After clicking the plus button in the Main Dashboard Screen, they enter their starting point of New York, as well as 3 destinations: UMass Amherst, Harvard, and MIT. They press the generate button which has now indicated throught its opacity that all fields are validated to create and view the itinerary.

## Plan Details Page

![delete](https://github.com/user-attachments/assets/ce40bf76-51b4-4e8f-a3b8-d13b4ba2eeca)

The Plan Details Page shows users their created plan with an embedded viewport from a maps app. Beneath the map with the plotted destinations is an order of destinations that would take the least amount of time / most efficient way to travel and visit in.

If the user realizes they have made a mistake with entering an incorrect destination, they can click the edit locations button which redirects them back to the Plan Creation Page to change their inputs. If the user realizes they don't want to save this generated plan at all, they can cancel its creation by pressing the delete button in the top left corner. If they would like to continue and save the plan, they can press the save button in the top right corder which redirects to the Main Dashboard Screen which should now display the new plan.

Use Case: 

A user just created a plan for visiting MA. However, they meant to input WPI instead of UMass Amherst. So they press the edit locations button which redirects them back to the Plan Creation Page to change their inputs and regenerate a new plan. They then save this plan which now appears in their dashboard.

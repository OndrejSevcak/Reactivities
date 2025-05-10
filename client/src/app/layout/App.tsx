import { Box, Container, CssBaseline } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    //fetch data using axios with specified response type
    axios.get<Activity[]>('https://localhost:7001/api/activities')
      .then(response => setActivities(response.data))

    //using fetch to get the data from the api
    // fetch('https://localhost:7001/api/activities')
    //   .then(response => response.json())  //wraping the javascript promise
    //   .then(data => setActivities(data))
    //   .catch(error => console.error('Error fetching activities:', error));

    //cleanup function
    return () => {}
  }, []);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(activity => activity.id === id));
  }

  const handleCancelSelectActivity = () => {
    setSelectedActivity(undefined);
  }

  const handleFormOpened = (id?: string) => {
    if (id) handleSelectActivity(id);
    else handleCancelSelectActivity();
    setEditMode(true);
  }

  const handleFormClosed = () => {
    setEditMode(false);
  }

  //I can either update an existing activity - activity.id is defined and approproate activity should be updated
  //or create a new activity -> new activity is added to the activities array
  const handleSubmitForm = (activity: Activity) => {
    if (activity.id){
      setActivities(activities.map(a => a.id === activity.id ? activity : a))
      //same as
        // setActivities(activities.map(a => {
        //   if(a.id === activity.id){
        //     return activity;
        //   }
        //   else{
        //     return a;
        //   }
        // }))
      //the result of activities.map() is a new array and the length of resulting array is always the same as the original array
      //in the new array the updated activity has replaced the old one, all other activities remain unchanged
      //This approach ensures immutability, a key principle in React state management. 
      //Instead of modifying the original activities array directly, a new array is created and used to update the state. 
      //This helps React detect changes and re-render the component efficiently.
    }
    else{
      const newActivity = {...activity, id: activities.length.toString()}      
      setActivities([...activities, newActivity])
      setSelectedActivity(newActivity)
      //expression [...activities] creates a shallow copy of the activities array (original array is not modified directly)
      //expression {..activity, id: activities.length.toString()} creates a new object that contains all properties of the activity object and adds a new property id with a value of the current length of the activities array
      //The spread operator {...activity} copies all the properties of the activity object into the new object.
      //The activities.length.toString() ensures that the id is a string representation of the array's length, which can serve as a simple unique identifier for the new activity.
    }
    setEditMode(false);
  }

  const handleDeleteActivity = (id: string) => {
    //remove the activity with the specified id from the activities array
    setActivities(activities.filter(activity => activity.id !== id));
    //filter() creates a new array with all elements that pass the test implemented by the provided function
  }

  return (
      <Box sx={{bgcolor: '#eeeeee'}}>
          <CssBaseline />
          <NavBar onOpenForm={handleFormOpened} />
          <Container maxWidth='xl' sx={{ mt: 3 }}>
              <ActivityDashboard 
                  activities={activities} 
                  selectActivity={handleSelectActivity}
                  cancelSelectActivity={handleCancelSelectActivity}
                  selectedActivity={selectedActivity}
                  editMode={editMode}
                  onFormOpen={handleFormOpened}
                  onFormClose={handleFormClosed}
                  onFormSubmit={handleSubmitForm}
                  onDeleteActivity={handleDeleteActivity}
              />
          </Container>
      </Box>
  )
}

export default App

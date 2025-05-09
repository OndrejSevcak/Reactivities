import { Box, Container, CssBaseline } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);

  useEffect(() => {
    //fetch datat using axios with specified response type
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

  return (
      <Box sx={{bgcolor: '#eeeeee'}}>
          <CssBaseline />
          <NavBar />
          <Container maxWidth='xl' sx={{ mt: 3 }}>
              <ActivityDashboard 
                  activities={activities} 
                  selectActivity={handleSelectActivity}
                  cancelSelectActivity={handleCancelSelectActivity}
                  selectedActivity={selectedActivity}
              />
          </Container>
      </Box>
  )
}

export default App

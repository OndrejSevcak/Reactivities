import { Container, CssBaseline } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/ActivityDashboard";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

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

  return (
      <>
          <CssBaseline />
          <NavBar />
          <Container maxWidth='xl' sx={{ mt: 3 }}>
            <ActivityDashboard activities={activities} />
          </Container>
      </>
  )
}

export default App

import { Box, Container, CssBaseline, Typography } from "@mui/material";
import { useState } from "react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { useActivities } from "../../lib/hooks/useActivities";

function App() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  //using custom hook to fetch activities using tanstack query
  const {activities, isPending} = useActivities();


  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities!.find(activity => activity.id === id));
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

  return (
      <Box sx={{bgcolor: '#eeeeee', minHeight: '100vh'}}>
          <CssBaseline />
          <NavBar onOpenForm={handleFormOpened} />
          <Container maxWidth='xl' sx={{ mt: 3 }}>
              {!activities || isPending ? (
                <Typography>Loading</Typography>
              ) : (
                <ActivityDashboard 
                  activities={activities} 
                  selectActivity={handleSelectActivity}
                  cancelSelectActivity={handleCancelSelectActivity}
                  selectedActivity={selectedActivity}
                  editMode={editMode}
                  onFormOpen={handleFormOpened}
                  onFormClose={handleFormClosed}
              />
              )}

          </Container>
      </Box>
  )
}

export default App

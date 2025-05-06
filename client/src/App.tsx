import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function App() {
  const title = 'Welcome to Reactivities'
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch('https://localhost:7001/api/activities')
      .then(response => response.json())  //wraping the javascript promise
      .then(data => setActivities(data))
      .catch(error => console.error('Error fetching activities:', error));

    //cleanup function
    return () => {}
  }, []);

  return (
    <>
      <Typography variant='h3'>{title}</Typography>
      <List>
        {activities.map((activity) => (
          <ListItem key={activity.id}>
            <ListItemText>{activity.title}</ListItemText>
          </ ListItem>
        ))}
      </List>
    </>
  )
}

export default App

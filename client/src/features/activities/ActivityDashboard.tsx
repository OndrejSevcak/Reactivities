import { Grid, List, ListItem, ListItemText } from "@mui/material";

type Props = {
    activities: Activity[],
    name?: string 
}

export default function ActivityDashboard({activities, name}: Props) {    
    return (
        <Grid container>
            <Grid size={9}>
                <h5>{name ?? "Larsen"}</h5>
                <List>
                    {activities.map((activity) => (
                        <ListItem key={activity.id}>
                        <ListItemText>{activity.title}</ListItemText>
                        </ ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>
  )
}
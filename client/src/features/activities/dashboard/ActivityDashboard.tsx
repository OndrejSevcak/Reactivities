import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";

// type Props = {
//     activities: Activity[],
//     selectActivity: (id: string) => void,
//     cancelSelectActivity: () => void,
//     selectedActivity?: Activity,
//     editMode: boolean,
//     onFormOpen: (id?: string) => void,
//     onFormClose: () => void
// }

export default function ActivityDashboard() {  
    return (
        <Grid container spacing={3}>
            <Grid size={7}>
                <ActivityList />
            </Grid>
            <Grid size={5}>
                <ActivityFilters />
            </Grid>
        </Grid>
  )
}
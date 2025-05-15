import { Grid, Typography } from "@mui/material"
import { useParams } from "react-router";
import { useActivities } from "../../../lib/hooks/useActivities";
import ActivityDetailsHeader from "./ActivityDetailsHeader";
import ActivityDetailsInfo from "./ActivityDetailsInfo";
import ActivityDetailsChat from "./ActivityDetailsChat";
import ActivityDetailsSidebar from "./ActivityDetailsSidebar";

// type Props = {
//     selectedActivity: Activity,
//     handleCancelSelectActivity: () => void,
//     handleEditSelectedActivity: (id: string) => void
// }

export default function ActivityDetailPage() {
    //get the activity id from the url using the useParams hook
    const {id} = useParams();   //the param name is the same as the one in the route path defined in Routes.tsx    
    const {activity, isLoadingActivity} = useActivities(id);

    if(isLoadingActivity) return <Typography>Loading..</Typography>
    if(!activity) return <Typography>Activity not found.</Typography>

    return (
        <Grid container spacing={3}>
            <Grid size={8}>
                <ActivityDetailsHeader activity={activity} />
                <ActivityDetailsInfo activity={activity} />
                <ActivityDetailsChat />
            </Grid>
            <Grid size={4}>
                <ActivityDetailsSidebar />
            </Grid>
        </Grid>
  )
}
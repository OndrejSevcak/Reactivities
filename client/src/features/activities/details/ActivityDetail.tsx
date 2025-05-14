import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material"
import { Link, useNavigate, useParams } from "react-router";
import { useActivities } from "../../../lib/hooks/useActivities";

// type Props = {
//     selectedActivity: Activity,
//     handleCancelSelectActivity: () => void,
//     handleEditSelectedActivity: (id: string) => void
// }

export default function ActivityDetail() {
    const navigate = useNavigate();     //react-router hook
    
    //get the activity id from the url using the useParams hook
    const {id} = useParams();   //the param name is the same as the one in the route path defined in Routes.tsx    
    const {activity, isLoadingActivity} = useActivities(id);

    if(isLoadingActivity) return <Typography>Loading..</Typography>
    if(!activity) return <Typography>Activity not found.</Typography>

    return (
        <Card sx={{borderRadius: 3}}>
            <CardMedia
                component="img"
                src={`/images/categoryImages/${activity.category}.jpg`}
                alt={activity.title}  
            />
            <CardContent>
                <Typography variant="h5">{activity.title}</Typography>
                <Typography variant="subtitle1" fontWeight='light'>{activity.date}</Typography>
                <Typography variant="body1">{activity.description}</Typography>
            </CardContent>
            <CardActions>
                {/* <Button color="primary" onClick={() => handleEditSelectedActivity(activity.id)} >Edit</Button> */}
                <Button component={Link} to={`/edit/${activity.id}`} color="primary">Edit</Button>
                <Button color="inherit" onClick={() => navigate('/activities')}>Cancel</Button>
            </CardActions>
        </Card>
  )
}
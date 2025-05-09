import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material"

type Props = {
    activity: Activity,
    handleCancelSelectActivity: () => void,
    handleEditSelectedActivity: (id: string) => void
}

export default function ActivityDetail({activity, handleCancelSelectActivity, handleEditSelectedActivity}: Props) {
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
            <Button color="primary" onClick={() => handleEditSelectedActivity(activity.id)} >Edit</Button>
            <Button color="inherit" onClick={handleCancelSelectActivity}>Cancel</Button>
        </CardActions>
    </Card>
  )
}
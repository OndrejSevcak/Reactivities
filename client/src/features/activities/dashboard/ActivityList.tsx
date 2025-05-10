import { Box } from "@mui/material";
import ActivityCard from "./ActivityCard";

type Props = {
    activities: Activity[],
    handleSelectActivity: (id: string) => void,
    handleDeleteActivity: (id: string) => void    
}

export default function ActivityList({activities, handleSelectActivity, handleDeleteActivity}: Props) {            
    
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
            {activities.map((activity) => (
                <ActivityCard 
                    key={activity.id} 
                    activity={activity} 
                    onViewClick={() => handleSelectActivity(activity.id)} 
                    onDeleteClick={() => handleDeleteActivity(activity.id)} /> 
            ))}
        </Box>
    )
}
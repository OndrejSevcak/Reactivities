import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityDetail from "../details/ActivityDetail";
import ActivityForm from "../form/ActivityForm";

type Props = {
    activities: Activity[],
    selectActivity: (id: string) => void,
    cancelSelectActivity: () => void,
    selectedActivity?: Activity,
    editMode: boolean,
    onFormOpen: (id?: string) => void,
    onFormClose: () => void,
    onFormSubmit: (activity: Activity) => void,
    onDeleteActivity: (id: string) => void
}

export default function ActivityDashboard({activities, selectActivity, cancelSelectActivity, selectedActivity, onFormClose, onFormOpen, editMode, onFormSubmit, onDeleteActivity}: Props) {  

    return (
        <Grid container spacing={3}>
            <Grid size={7}>
                <ActivityList 
                    activities={activities} 
                    handleSelectActivity={selectActivity}
                    handleDeleteActivity={onDeleteActivity} />
            </Grid>
            <Grid size={5}>
                {selectedActivity && !editMode &&
                    <ActivityDetail 
                        activity={selectedActivity} 
                        handleCancelSelectActivity={cancelSelectActivity} 
                        handleEditSelectedActivity={onFormOpen} />
                }
                {editMode  && 
                    <ActivityForm 
                        onFormClose={onFormClose} 
                        activity={selectedActivity} 
                        onFormSubmit={onFormSubmit} />}
            </Grid>
        </Grid>
  )
}
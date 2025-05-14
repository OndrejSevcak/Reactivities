import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";


export default function ActivityForm() {
    const {id} = useParams();
    const {updateActivity, createActivity, activity, isLoadingActivity} = useActivities(id);
    const navigate = useNavigate();

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget); //built-in browser API that allows you to easily construct a set of key/value pairs representing form fields and their values.
        const data: {[key: string]: FormDataEntryValue} = {}    //each key is a string and each value is a FormDataEntryValue (which can be a string or a File object)
        formData.forEach((value, key) => {
            data[key] = value;
        });
        console.log(formData);
        console.log(data);

        if (activity){
            data.id = activity.id; //if we are working on an existing activity (editing)
            await updateActivity.mutateAsync(data as unknown as Activity);  //we need to wait for this to finish before closing the form -> thats why we use async version
            navigate(`/activities/${activity.id}`);
        }
        else{
            await createActivity.mutate(data as unknown as Activity, {
                onSuccess: (id) => {
                    navigate(`/activities/${id}`); //navigate to the new activity detail page
                }
            });
        }
    }

    if(isLoadingActivity) return <Typography>Loading...</Typography>

    return (
        <Paper sx={{ borderRadius: 3, padding: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
                {activity ? 'Edit Activity' : 'Create Activity'}
            </Typography>
            <Box component="form" onSubmit={handleFormSubmit} display="flex" flexDirection="column" gap={3}>
                <TextField name="title" label="Title" defaultValue={activity?.title} />
                <TextField name="description" label="Description" defaultValue={activity?.description} multiline rows={3} />
                <TextField name="category" label="Category" defaultValue={activity?.category} />
                <TextField name="date" label="Date" type="date" 
                    defaultValue={activity?.date 
                        ? new Date(activity.date).toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0] } />
                <TextField name="city" label="City" defaultValue={activity?.city} />
                <TextField name="venue" label="Venue" defaultValue={activity?.venue} />
                <Box display="flex" justifyContent="end" gap={2}>
                    <Button color="inherit" onClick={() => navigate(`/activities/${activity?.id}`)}>Cancel</Button>
                    <Button 
                        type="submit" 
                        color="success" 
                        variant="contained"
                        disabled={updateActivity.isPending || createActivity.isPending}
                    >Submit</Button>
                </Box>
            </Box>            
        </Paper>
    )
}
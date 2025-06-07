import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useEffect } from "react";
import { activitySchema, type ActivitySchema } from "../../../lib/schemas/activitySchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ActivityForm() {
    const { register, reset, handleSubmit, formState: {errors} } = useForm<ActivitySchema>({             //react-hook-form with type parameter ActivitySchema
        //here we can specify how we want to validate this form
        mode: 'onTouched',  //validation mode
        resolver: zodResolver(activitySchema),  //validation schema and resolver
    });    
    const {id} = useParams();
    const {updateActivity, createActivity, activity, isLoadingActivity} = useActivities(id);

    //to reset the form we need to implement a useEffect hook
    useEffect(() => {
        if(activity) reset(activity);
    }, [activity, reset]);

    const onSubmit = (data: ActivitySchema) => {
        console.log(data);
    }

    if(isLoadingActivity) return <Typography>Loading...</Typography>

    return (
        <Paper sx={{ borderRadius: 3, padding: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
                {activity ? 'Edit Activity' : 'Create Activity'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={3}>
                <TextField
                     {...register('title')} 
                     label="Title" 
                     defaultValue={activity?.title} 
                     error={!!errors.title} 
                     helperText={errors.title?.message} />
                <TextField {...register('description')} label="Description" defaultValue={activity?.description} multiline rows={3} />
                <TextField {...register('category')} label="Category" defaultValue={activity?.category} />
                <TextField {...register('date')} label="Date" type="date" 
                    defaultValue={activity?.date 
                        ? new Date(activity.date).toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0] } />
                <TextField {...register('city')} label="City" defaultValue={activity?.city} />
                <TextField {...register('venue')} label="Venue" defaultValue={activity?.venue} />
                <Box display="flex" justifyContent="end" gap={2}>
                    <Button color="inherit">Cancel</Button>
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
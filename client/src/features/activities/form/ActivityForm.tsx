import { Box, Button, Paper, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useEffect } from "react";
import { activitySchema, type ActivitySchema } from "../../../lib/schemas/activitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../app/shared/components/TextInput";

export default function ActivityForm() {
    const { control, reset, handleSubmit } = useForm<ActivitySchema>({             //react-hook-form with type parameter ActivitySchema
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
                <TextInput label='Title' control={control} name="title" />  
                <TextInput label='Description' control={control} name="description" multiline rows={3} />  
                <TextInput label='Category' control={control} name="category" />  
                <TextInput label='Date' control={control} name="date" />  
                <TextInput label='City' control={control} name="city" />
                <TextInput label='Venue' control={control} name="venue" />  
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
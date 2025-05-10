import { Box, Button, Paper, TextField, Typography } from "@mui/material";

type Props = {
    onFormClose: () => void,
    activity?: Activity,
    onFormSubmit: (activity: Activity) => void   
}

export default function ActivityForm({ onFormClose, activity, onFormSubmit }: Props) {
    
    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget); //built-in browser API that allows you to easily construct a set of key/value pairs representing form fields and their values.
        const data: {[key: string]: FormDataEntryValue} = {}    //each key is a string and each value is a FormDataEntryValue (which can be a string or a File object)
        formData.forEach((value, key) => {
            data[key] = value;
        });
        console.log(formData);
        console.log(data);

        if (activity) data.id = activity.id; //if we are working on an existing activity (editing)
        onFormSubmit(data as unknown as Activity);
    }

    return (
        <Paper sx={{ borderRadius: 3, padding: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
                Create activity
            </Typography>
            <Box component="form" onSubmit={handleFormSubmit} display="flex" flexDirection="column" gap={3}>
                <TextField name="title" label="Title" defaultValue={activity?.title} />
                <TextField name="description" label="Description" defaultValue={activity?.description} multiline rows={3} />
                <TextField name="category" label="Category" defaultValue={activity?.category} />
                <TextField name="date" label="Date" type="date" defaultValue={activity?.date} />
                <TextField name="city" label="City" defaultValue={activity?.city} />
                <TextField name="venue" label="Venue" defaultValue={activity?.venue} />
                <Box display="flex" justifyContent="end" gap={2}>
                    <Button color="inherit" onClick={onFormClose}>Cancel</Button>
                    <Button type="submit" color="success" variant="contained">Submit</Button>
                </Box>
            </Box>            
        </Paper>
    )
}
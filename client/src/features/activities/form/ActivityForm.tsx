import { Box, Button, Paper, TextField, Typography } from "@mui/material";

type Props = {
    onFormClose: () => void,
    activity?: Activity,   
}

export default function ActivityForm({ onFormClose, activity }: Props) {
    return (
        <Paper sx={{ borderRadius: 3, padding: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
                Create activity
            </Typography>
            <Box component="form" display="flex" flexDirection="column" gap={3}>
                <TextField label="Title" />
                <TextField label="Description" multiline rows={3} />
                <TextField label="Category" />
                <TextField label="Date" type="date" />
                <TextField label="City" />
                <TextField label="Venue" />
                <Box display="flex" justifyContent="end" gap={2}>
                    <Button color="inherit" onClick={onFormClose}>Cancel</Button>
                    <Button color="success" variant="contained">Submit</Button>
                </Box>
            </Box>            
        </Paper>
    )
}
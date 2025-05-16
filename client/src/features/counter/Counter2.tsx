import { Box, Button, ButtonGroup, List, ListItemText, Paper } from "@mui/material";
import { useStore } from "../../lib/hooks/useStore"
import { observer } from "mobx-react-lite";

//cleaner way to use observer() to wrap the whole function instead of <Observer>

const Counter = observer(function Counter() {
    const {counterStore} = useStore();
 
    return (
        <Box display='flex' justifyContent='space-between'>
            <Box sx={{width: '60%'}}>
                <h2>Title: {counterStore.title}</h2>
                <h4>Counter: {counterStore.count}</h4>
                <ButtonGroup sx={{ mt: 2 }}>
                    <Button onClick={() => counterStore.decrement()} variant="contained" color="error">Decrement</Button>
                    <Button onClick={() => counterStore.increment()} variant="contained" color="success">Increment</Button>
                    <Button onClick={() => counterStore.increment(5)} variant="contained" color="primary">Increment by 5</Button>
                </ButtonGroup>
            </Box>
            <Paper sx={{width: '40%', padding: 2}}>
                <h2>Counter events ({counterStore.eventCount})</h2>
                <List>
                    {counterStore.events.map((event, index) => (
                        <ListItemText key={index}>{event}</ListItemText>
                    ))}
                </List>
            </Paper>
        </Box>

  )
});

export default Counter;
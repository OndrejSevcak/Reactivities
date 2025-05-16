import { Button, ButtonGroup } from "@mui/material";
import { useStore } from "../../lib/hooks/useStore"
import { Observer } from "mobx-react-lite";

export default function Counter() {
    const {counterStore} = useStore();
 
    return (
        <>
            <Observer>
                {/* //anything inside has the power to observeour MobX state */}
                {() => (
                    <div>
                        <h4>Title: {counterStore.title}</h4>
                        <h6>Counter: {counterStore.count}</h6>
                    </div>
                )}
            </Observer>
            <ButtonGroup sx={{ mt: 2 }}>
                <Button onClick={() => counterStore.decrement()} variant="contained" color="error">Decrement</Button>
                <Button onClick={() => counterStore.increment()} variant="contained" color="success">Increment</Button>
                <Button onClick={() => counterStore.increment(5)} variant="contained" color="primary">Increment by 5</Button>

            </ButtonGroup>
        </>

  )
}
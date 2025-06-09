import { TextField, type TextFieldProps } from "@mui/material";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form";

type Props<T extends FieldValues> = {} & UseControllerProps<T> & TextFieldProps //extending types from MUI TextFieldProps and UseControllerProps

export default function TextInput<T extends FieldValues>(props: Props<T>) {
    const {field, fieldState} = useController({...props}); //The spread operator (...props) is used to pass all properties from the props object individually as arguments to the useController hook
    return (
        <TextField
            {...props}
            {...field}
            fullWidth
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
        />
    )
}
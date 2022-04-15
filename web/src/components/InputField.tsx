import { FormControl, FormLabel, Input, FormHelperText, FormErrorMessage } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
}

export const InputField: React.FC<InputFieldProps> = ({label, size:_, ...props}) => {
    const [field, {error}] = useField(props)
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input {...field } {...props} id={field.name} placeholder={props.placeholder}/>
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    ); 
}
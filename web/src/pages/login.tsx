import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react'
import { InputField } from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
        const router = useRouter();
        const [,login] = useLoginMutation()
        return (
            <Wrapper variant='small'>
                <Formik
                    initialValues={{username: "", password: ""}}
                    onSubmit={async (values, {setErrors}) => {
                        const response = await login({options: values});
                        if(response.data?.login.errors) {
                            setErrors(toErrorMap(response.data.login.errors))
                        } else if (response.data?.login.user) {
                            router.push("/");
                        }
                    }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="username"
                            placeholder="username"
                            label="Username"
                        />
                        <Box mt={4}>
                        {/* <InputField name="email" placeholder="email" label="Email" /> */}
                        </Box>
                        <Box mt={4}>
                        <InputField
                            name="password"
                            placeholder="password"
                            label="Password"
                            type="password"
                        />
                        </Box>
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            colorScheme='teal'
                        >
                        login
                        </Button>
                    </Form>
                )}
                </Formik>
            </Wrapper>
        );
}

export default Login;
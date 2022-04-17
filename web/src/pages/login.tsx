import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react'
import { InputField } from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import NextLink from "next/link";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
        const router = useRouter();
        const [,login] = useLoginMutation()
        return (
            <Wrapper variant='small'>
                <Formik
                    initialValues={{usernameOrEmail: "", password: ""}}
                    onSubmit={async (values, {setErrors}) => {
                        const response = await login(values);
                        if(response.data?.login.errors) {
                            setErrors(toErrorMap(response.data.login.errors))
                        } else if (response.data?.login.user) {
                            router.push("/");
                        }
                    }}>
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="usernameOrEmail"
                            placeholder="username or email"
                            label="Username or Email"
                        />
                        <Box mt={4}>
                        <InputField
                            name="password"
                            placeholder="password"
                            label="Password"
                            type="password"
                        />
                        </Box>
                        <Flex mt={2}>
                            <NextLink href='/forgot-password'>
                                <Link ml={"auto"}>
                                    forgot password?
                                </Link>
                            </NextLink>
                        </Flex>
                        <Flex mt={4}>
                        <Button
                            mr={4}
                            type="submit"
                            isLoading={isSubmitting}
                            colorScheme='teal'
                        >
                        login
                        </Button>
                        <Link href="/register">
                            <Button
                                type="button"
                                colorScheme='messenger'
                            >
                                register
                            </Button>
                        </Link>
                        </Flex>
                    </Form>
                )}
                </Formik>
            </Wrapper>
        );
}

export default withUrqlClient(createUrqlClient) (Login);
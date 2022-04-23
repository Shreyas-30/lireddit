import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react'
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{fetching: logoutFetching},logout] = useLogoutMutation()
    const [{ data, fetching }] = useMeQuery({
        pause: isServer(),
    });
    let body = null;

    if(fetching) {
        //data is loading
    } else if (!data?.me) {
        //user not logged in
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={2}>login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link>register</Link>
                </NextLink>
            </>
        )
    } else {
        //users logged in 
        body = (
            <Flex align="center">
                <NextLink href="/create-post">
                    <Button as={Link} mr={4}>
                        create post
                    </Button>
                </NextLink>
                <Box mr={2}>
                    {data.me.username}
                </Box>
                <Button onClick={() => {
                    logout();
                }} 
                isLoading={logoutFetching}
                variant={"link"}>logout</Button>
            </Flex>
            )
    }

    return (
        <Flex zIndex={1} position={"sticky"} top={1} bg="tan" p={4} >
            <Flex flex={1} m="auto" maxW={800} align="center">
            <NextLink href="/">
                <Link>
                    <Heading>LiReddit</Heading>
                </Link>
            </NextLink>
            <Box ml={"auto"}>
                {body}  
            </Box>
            </Flex>
        </Flex>
    );
}
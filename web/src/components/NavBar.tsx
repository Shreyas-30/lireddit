import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react'
import NextLink from "next/link"
import { useMeQuery } from '../generated/graphql';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{data, fetching}] = useMeQuery()
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
            <Flex>
                <Box mr={2}>
                    {data.me.username}
                </Box>
                <Button variant={"link"}>logout</Button>
            </Flex>
            )
    }

    return (
        <Flex bg="tomato" p={4}>
            <Box ml={"auto"}>
                {body}  
            </Box>
        </Flex>
    );
}
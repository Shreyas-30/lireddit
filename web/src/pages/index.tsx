import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { Layout } from '../components/Layout'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
const Index = () => {
  const [{data, fetching}] = usePostsQuery({
    variables: {
      limit: 10
    }
  })
  if(!fetching && !data) {
    return <div>query failed for some reason</div>
  }
  return (
    <Layout>
      <Flex align="baseline">
        <Heading>LiReddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">
            create post
          </Link>
      </NextLink>
      </Flex>
    <br />
    {!data && fetching ? (
      <div>loading...</div>
      ) : (
      <Stack spacing={8}>
        {data!.posts.map((p) => (
          <Box key={p.id} p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">{p.title}</Heading>
            <Text mt={4}>{p.textSnippet}</Text>
          </Box>)
          )}
      </Stack>
      )}
      {data ? (<Flex><Button isLoading={fetching} m="auto" my={8} >load more</Button></Flex>) : null}
    </Layout>
    );
}

export default withUrqlClient(createUrqlClient, {ssr: false})(Index) 

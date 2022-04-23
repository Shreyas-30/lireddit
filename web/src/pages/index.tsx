import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Heading, Icon, IconButton, Link, Stack, Text } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { useState } from 'react'
import { Layout } from '../components/Layout'
import { UpdootSection } from '../components/UpdootSection'
import { useDeletePostMutation, usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });
  const [, deletePost] = useDeletePostMutation()
  if(!fetching && !data) {
    return <div>query failed for some reason</div>
  }
  return (
    <Layout>
    {!data && fetching ? (
      <div>loading...</div>
      ) : (
      <Stack spacing={8}>
        {data!.posts.posts.map((p) => 
          !p ? null : (
          <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
            <UpdootSection post={p}/>
            <Box flex={1}>
            <NextLink href="post/[id]" as={`post/${p.id}`}><Heading fontSize="xl"><Link>{p.title}</Link></Heading></NextLink>
            <Text>posted by {p.creator.username}</Text>
            <Flex align="center">
              <Text flex={1} mt={4}>{p.textSnippet}</Text>
              <IconButton 
                ml="auto" 
                icon={<DeleteIcon />} 
                colorScheme="red" 
                aria-label='Delete Post' 
                onClick={async () => {
                  await deletePost({id: p.id})
                  // window.alert("Deleted post " + p.id);
                }
              } />
            </Flex>
            </Box>
          </Flex>)
          )}
      </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
    );
}

export default withUrqlClient(createUrqlClient, {ssr: false})(Index) 

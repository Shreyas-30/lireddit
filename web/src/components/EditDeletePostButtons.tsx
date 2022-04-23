import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, IconButton, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react'
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps {
    id: number
    creatorId: number
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({id, creatorId}) => {
    const [, deletePost] = useDeletePostMutation()
    const [{data: MeData}] = useMeQuery()

    if(MeData?.me?.id !== creatorId) {
        return null
    }
    return (
    <Box>
    <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
      <IconButton
        as={Link}
        mr={4}
        icon={<EditIcon />} 
        aria-label='Edit Post' 
        onClick={async () => {

        }
      } />
    </NextLink>
    <IconButton 
      icon={<DeleteIcon />} 
      colorScheme="red" 
      aria-label='Delete Post' 
      onClick={async () => {
        await deletePost({id})
        // window.alert("Deleted post " + p.id);
      }
    } />
  </Box>);
}
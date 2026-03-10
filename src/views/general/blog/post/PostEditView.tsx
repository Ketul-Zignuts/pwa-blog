'use client'
import React from 'react'
import PostForm from '@views/general/blog/post/PostForm';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { userPostDetailGetAction } from '@/constants/api/post';

const PostEditView = () => {
    const params = useParams()
    const postId = params?.id as string

    const { data: postData, isLoading } = useQuery({
        queryKey: ['user-post-detail', postId],
        queryFn: () => userPostDetailGetAction(postId),
        enabled: !!postId,
    })

    return (
        <PostForm data={postData?.data} fromEdit={true} />
    )
}

export default PostEditView;
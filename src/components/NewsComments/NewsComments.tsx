import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchNewsComments } from '../../store/NewsDetailsSlice'

type NewsCommentsProps = {
    idsComments: number[]
}

function NewsComments({ idsComments }: NewsCommentsProps) {
    const comments = useAppSelector(state => state.newsDetails.comments)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchNewsComments(idsComments));
    }, [idsComments])
    return (
        <>
            {comments?.map(el =>
                <p>
                    {el.text}
                </p>
            )}
        </>
    )
}

export default NewsComments
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchNewsComments } from '../../store/NewsDetailsSlice'
import { ItemTreeNode } from '../../commonTypes'
import styles from "./NewsComments.module.css"
import treeToList from '../../utils/treeToList'
import { IconButton } from '@vkontakte/vkui'
import { Icon28RefreshOutline } from '@vkontakte/icons'
import CommentEach from '../../components/CommentEach/CommentEach'

function NewsComments() {
    const { newsDetails, comments } = useAppSelector(state => state.newsDetails)
    const [flatCommentTree, setCommentTree] = useState<(ItemTreeNode & { level: number })[]>([]);
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (newsDetails !== null) {
            dispatch(fetchNewsComments(newsDetails));
        }
    }, [newsDetails])

    const openChildComms = (item: ItemTreeNode) => {
        dispatch(fetchNewsComments(item))
    }

    useEffect(() => {
        setCommentTree(treeToList(comments, (item, level) => ({ ...item, level })))
    }, [comments])


    return (
        <>
            <div className={styles.newsCommentHader}>
                <h1>
                    Comments:
                </h1>
                <IconButton className={styles.newsCommentRefresh} onClick={() => newsDetails !== null && dispatch(fetchNewsComments(newsDetails))}>
                    <Icon28RefreshOutline />
                </IconButton>
            </div>
            {flatCommentTree?.map(comment =>
                <CommentEach
                    comment={comment}
                    openChildComms={openChildComms}
                    key={comment.id}
                />
            )}
        </>
    )
}

export default NewsComments
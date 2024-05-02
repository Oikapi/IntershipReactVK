import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchNewsComments } from '../../store/NewsDetailsSlice'
import { ItemTreeNode } from '../../commonTypes'
import styles from "./NewsComments.module.css"
import treeToList from '../../utils/treeToList'
import { IconButton } from '@vkontakte/vkui'
import { Icon24Dropdown, Icon28RefreshOutline } from '@vkontakte/icons'

type NewsCommentsProps = {
    idsComments: number[];
}

function NewsComments() {
    const { newsDetails, comments } = useAppSelector(state => state.newsDetails)
    const [flatCommentTree, setCommentTree] = useState<ItemTreeNode[]>([]);
    const dispatch = useAppDispatch()
    console.log(comments)
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
            {flatCommentTree?.map(el =>
                <div className={styles.newsCommentEach} style={{ paddingLeft: `${20 * el.level}px` }}>
                    <h3>
                        {el.by}
                    </h3>
                    <p>
                        {el.text}
                    </p>
                    {el?.kids?.length &&
                        <IconButton onClick={() => openChildComms(el)}>
                            <Icon24Dropdown />
                        </IconButton>
                    }
                </div>
            )}
        </>
    )
}

export default NewsComments
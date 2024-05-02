import React, { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchNewsList } from '../../store/NewsListSlice'
import { IconButton, Panel, ScreenSpinner, Spinner, SplitLayout, Tappable } from '@vkontakte/vkui'
import styles from "./MainPanel.module.css"
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { Icon28RefreshOutline } from '@vkontakte/icons'


type MainPanelProps = {
    id: string
}

function MainPanel({ id }: MainPanelProps) {
    const dispatch = useAppDispatch()
    const routeNavigator = useRouteNavigator();
    const { loading, list } = useAppSelector(state => state.newsList)
    const [popout, setPopout] = useState<ReactElement | null>(<ScreenSpinner />)

    useEffect(() => {
        if (!list.length) {
            dispatch(fetchNewsList());
        }
    }, [])

    useEffect(() => {
        setPopout(loading ? <ScreenSpinner /> : null)
    }, [loading])

    return (
        <SplitLayout popout={popout} aria-live="polite" aria-busy={!!popout}>
            <Panel id={id}>
                <div className={styles.newsListHeader}>
                    <h1>
                        HackNews
                    </h1>
                    <IconButton className={styles.newsListRefresh} onClick={() => dispatch(fetchNewsList())}>
                        <Icon28RefreshOutline />
                    </IconButton>
                </div>
                <div className={styles.newsList}>
                    {
                        list.map((el) =>
                            <Tappable onClick={() => routeNavigator.push(`newsDetails/${el.id}`)} style={{ background: "#0000004D" }} >
                                < div className={styles.newsEach} >
                                    <h2>
                                        {el.title}
                                    </h2>
                                    <h2 className={styles.newsScore}>
                                        {el.score}
                                    </h2>
                                    <span>
                                        by {el.by}
                                    </span>
                                    <span className={styles.newsDate}>
                                        {new Date(el.time * 1000).toLocaleString()}
                                    </span>
                                </div>
                            </Tappable>
                        )
                    }
                </div>
            </Panel >
        </SplitLayout >
    )
}

export default MainPanel
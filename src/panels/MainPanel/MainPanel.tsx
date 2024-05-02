import React, { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchNewsList } from '../../store/NewsListSlice'
import { Panel, ScreenSpinner, Spinner, SplitLayout, Tappable } from '@vkontakte/vkui'
import styles from "./MainPanel.module.css"


type MainPanelProps = {
    id: string
}

function MainPanel({ id }: MainPanelProps) {
    const dispatch = useAppDispatch()
    const { loading, list } = useAppSelector(state => state.newsList)
    const [popout, setPopout] = useState<ReactElement | null>(<ScreenSpinner />)
    useEffect(() => {
        dispatch(fetchNewsList());
    }, [])

    useEffect(() => {
        setPopout(loading ? <ScreenSpinner /> : null)
    }, [loading])

    return (
        <SplitLayout popout={popout} aria-live="polite" aria-busy={!!popout}>
            <Panel id={id}>
                <div className={styles.newsList}>
                    {
                        list.map((el) =>
                            <Tappable onClick={() => console.log(123)} style={{ background: "#0000004D" }} >
                                <div className={styles.newsEach}>
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
                                        {new Date(el.time).toDateString()}
                                    </span>
                                </div>
                            </Tappable>
                        )
                    }
                </div>
            </Panel>
        </SplitLayout>
    )
}

export default MainPanel
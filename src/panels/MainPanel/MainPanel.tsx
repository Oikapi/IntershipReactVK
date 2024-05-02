import { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchNewsList } from '../../store/NewsListSlice'
import { IconButton, Panel, ScreenSpinner, SplitLayout } from '@vkontakte/vkui'
import styles from "./MainPanel.module.css"
import { Icon28RefreshOutline } from '@vkontakte/icons'
import NewsEach from '../../components/NewsEach/NewsEach'


type MainPanelProps = {
    id: string
}

function MainPanel({ id }: MainPanelProps) {
    const dispatch = useAppDispatch()
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
                        list.map((news) =>
                            <NewsEach
                                news={news}
                            />
                        )
                    }
                </div>
            </Panel >
        </SplitLayout >
    )
}

export default MainPanel
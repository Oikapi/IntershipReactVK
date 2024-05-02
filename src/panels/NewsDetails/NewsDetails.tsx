import { ReactElement, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { IconButton, Panel, ScreenSpinner, SplitLayout } from '@vkontakte/vkui'
import { useParams, useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { fetchNewsDetails } from '../../store/NewsDetailsSlice'
import styles from "./NewsDetails.module.css"
import { Icon24BrowserBack } from '@vkontakte/icons'
import NewsComments from '../../components/NewsComments/NewsComments'

type NewsDetailsProps = {
    id: string
}


function NewsDetails({ id }: NewsDetailsProps) {
    const dispatch = useAppDispatch()
    const params = useParams<"id">();
    const routeNavigator = useRouteNavigator();
    const { loading, newsDetails, comments } = useAppSelector(state => state.newsDetails)
    const [popout, setPopout] = useState<ReactElement | null>(null)
    useEffect(() => {
        dispatch(fetchNewsDetails(Number(params?.id)));
    }, [])
    // console.log(newsDetails)
    useEffect(() => {
        setPopout(loading ? <ScreenSpinner /> : null)
    }, [loading])

    return (
        <SplitLayout popout={popout} aria-live="polite" aria-busy={!!popout}>
            <Panel id={id} className={styles.newsDetails}>
                <div className={styles.newsDetailsHeader}>
                    <h1>
                        {newsDetails?.title}
                    </h1>
                    <IconButton onClick={() => routeNavigator.back()}>
                        <Icon24BrowserBack />
                    </IconButton>
                </div>
                <div className={styles.newsDetailsMainInfo}>
                    <h2>
                        {newsDetails?.by}
                    </h2>
                    <h2>
                        {new Date(1000 * (newsDetails?.time || 1)).toLocaleString()}
                    </h2>
                </div>
                <a href={newsDetails?.url}>Ссылка на статью</a>
                <div>
                    <NewsComments
                    />
                </div>
            </Panel>
        </SplitLayout>
    )
}

export default NewsDetails
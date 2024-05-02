import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Tappable } from '@vkontakte/vkui';
import styles from "./NewsEach.module.css"
import { Item } from '../../commonTypes';

type NewsEachProps = {
    news: Item;
}

function NewsEach({ news }: NewsEachProps) {
    const routeNavigator = useRouteNavigator();
    return (
        <Tappable onClick={() => routeNavigator.push(`newsDetails/${news.id}`)} style={{ background: "#0000004D" }} >
            < div className={styles.newsEach} >
                <h2>
                    {news.title}
                </h2>
                <h2 className={styles.newsScore}>
                    score: {news.score}
                </h2>
                <span>
                    by: {news.by}
                </span>
                <span className={styles.newsDate}>
                    {new Date(news.time * 1000).toLocaleString()}
                </span>
            </div>
        </Tappable>
    )
}

export default NewsEach
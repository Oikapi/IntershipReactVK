import { ItemTreeNode } from '../../commonTypes'
import { IconButton } from '@vkontakte/vkui';
import styles from "./CommentEach.module.css"
import { Icon24Dropdown } from '@vkontakte/icons';

type CommentEachType = {
    comment: ItemTreeNode;
    openChildComms: (comment: ItemTreeNode) => void;
}

function CommentEach({ comment, openChildComms }: CommentEachType) {
    return (
        <div className={styles.newsCommentEach} style={{ paddingLeft: `${20 * comment.level}px` }}>
            <h3>
                {comment.by}
            </h3>
            <p>
                {comment.text}
            </p>
            {comment?.kids?.length &&
                <IconButton onClick={() => openChildComms(comment)}>
                    <Icon24Dropdown />
                </IconButton>
            }
        </div>
    )
}

export default CommentEach
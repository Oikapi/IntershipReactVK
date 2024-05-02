import { ItemTreeNode } from "../commonTypes";

// Тип для колбэка, который принимает узел дерева и его уровень и возвращает что-то
type TreeCallback<T> = (item: ItemTreeNode, level: number) => T;

// Функция treeToList принимает массив узлов дерева, колбэк и опциональный уровень, возвращает массив элементов
export default function treeToList<T>(tree: ItemTreeNode[], callback: TreeCallback<T>, level = 0, result: T[] = []): T[] {
    for (const item of tree) {
        result.push(callback ? callback(item, level) : item as T);
        if (item.children?.length) treeToList(item.children, callback, level + 1, result);
    }
    return result;
}

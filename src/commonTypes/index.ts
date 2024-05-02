export interface Item{
    by: string
    descendants: number
    id: number
    kids: number[]
    score: number
    text: string
    time: number
    title: string
    type: string,
    url : string,
    parent : number,
}

export interface ItemTreeNode extends Item {
    children : ItemTreeNode[]
}
  
  
  
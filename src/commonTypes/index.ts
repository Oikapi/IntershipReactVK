export interface News {
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
  }

  export interface Comment {
    by: string
    id: number
    parent: number
    text: string
    time: number
    type: string
  }
  
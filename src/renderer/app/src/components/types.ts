export type TableAction = {
  key: number
  btnName: string
  handler: (id: number) => void
}

export type TableColumn = {
  title: string
  key: number
}

export type TableRow = {
  id: number
  [key: string]:
    | boolean
    | string
    | number
    | string[]
    | { value: string | number; image?: string; icon?: string; iconColor?: string }
}

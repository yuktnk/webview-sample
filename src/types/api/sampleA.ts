export type SampleAType1Response = {
  id: string
  title: string
  value: number
  date: string
}

export type SampleAType2Response = {
  id: string
  title: string
  items: {
    label: string
    count: number
  }[]
}

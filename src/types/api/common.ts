export type UserInfoResponse = {
  clientUserId: string
  groupId: string
  stores: {
    akrCode: string
    storeName: string
  }[]
}

export type BatchDateResponse = {
  latestDate: string
}

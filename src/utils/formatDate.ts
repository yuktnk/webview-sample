export const formatDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-')
  return `${year}年${month}月${day}日`
}

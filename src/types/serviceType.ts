export const SERVICE_TYPE_VALUES = [
  'type_1',
  'type_2',
  'type_3',
  'type_4',
  'type_5',
] as const

export type ServiceType = typeof SERVICE_TYPE_VALUES[number]

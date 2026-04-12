export const FROM_VALUES = ['sample_a', 'sample_b'] as const

export type FromType = (typeof FROM_VALUES)[number]

export const SERVICE_TYPE_VALUES = [
  'type_1',
  'type_2',
  'type_3',
  'type_4',
  'type_5',
] as const

export type ServiceType = (typeof SERVICE_TYPE_VALUES)[number]

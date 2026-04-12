export const FROM_VALUES = ['sample_a', 'sample_b'] as const

export type FromType = (typeof FROM_VALUES)[number]

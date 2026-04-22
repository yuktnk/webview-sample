import type { FromType, ServiceType } from '@/types/routing'
import { SampleAType1Container } from './sampleA/type1'
import { SampleAType2Container } from './sampleA/type2'
import { SampleBType1Container } from './sampleB/type1'

export const CONTAINER_MAP = {
  sample_a: {
    type_1: SampleAType1Container,
    type_2: SampleAType2Container,
  },
  sample_b: {
    type_1: SampleBType1Container,
  },
} satisfies Record<FromType, Partial<Record<ServiceType, React.ComponentType>>>

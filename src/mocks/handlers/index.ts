import { commonHandlers } from './common'
import { sampleAHandlers } from './sampleA'
import { sampleBHandlers } from './sampleB'

export const handlers = [...commonHandlers, ...sampleAHandlers, ...sampleBHandlers]

import { Lesson } from '../types.ts';
import { LEVEL1_LESSONS } from './lessons/level1.ts';
import { LEVEL2_LESSONS } from './lessons/level2.ts';
import { LEVEL3_LESSONS } from './lessons/level3.ts';
import { LEVEL4_LESSONS } from './lessons/level4.ts';
import { LEVEL5_LESSONS } from './lessons/level5.ts';
import { LEVEL6_LESSONS } from './lessons/level6.ts';
import { LEVEL7_LESSONS } from './lessons/level7.ts';
import { LEVEL8_LESSONS } from './lessons/level8.ts';

export const FALLBACK_LESSONS: Lesson[] = [
  ...LEVEL1_LESSONS,
  ...LEVEL2_LESSONS,
  ...LEVEL3_LESSONS,
  ...LEVEL4_LESSONS,
  ...LEVEL5_LESSONS,
  ...LEVEL6_LESSONS,
  ...LEVEL7_LESSONS,
  ...LEVEL8_LESSONS
];

export {
  LEVEL1_LESSONS,
  LEVEL2_LESSONS,
  LEVEL3_LESSONS,
  LEVEL4_LESSONS,
  LEVEL5_LESSONS,
  LEVEL6_LESSONS,
  LEVEL7_LESSONS,
  LEVEL8_LESSONS
};

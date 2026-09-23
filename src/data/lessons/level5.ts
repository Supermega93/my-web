import { Lesson } from "../../types.ts";

// Level 5 Client-Side Metadata
// Note: Proprietary lesson text is protected server-side and delivered exclusively via /api/academy/lessons/:id for verified Paid and Complimentary students.
export const LEVEL5_LESSONS: Lesson[] = [
  {
    "id": "lesson-5-1",
    "course_id": "00000000-0000-0000-0000-000000000005",
    "order_index": 18,
    "level_name": "Level 5: High School — The Safety Shield & Risk Architecture",
    "lesson_number": 1,
    "title": "Lesson 5.1: Automatic Lot Sizing & Lot Clamping 🧮",
    "summary": "Dynamic position sizing based on 1.0% account risk and Stop Loss distance, plus broker lot clamping using VOLUME_MIN, VOLUME_MAX, and VOLUME_STEP.",
    "duration_minutes": 15,
    "is_free": false,
    "content": ""
  },
  {
    "id": "lesson-5-2",
    "course_id": "00000000-0000-0000-0000-000000000005",
    "order_index": 19,
    "level_name": "Level 5: High School — The Safety Shield & Risk Architecture",
    "lesson_number": 2,
    "title": "Lesson 5.2: Prop Firm Safety Nets & Daily Loss Limits 🛡️",
    "summary": "The midnight equity snapshot, real-time daily drawdown tracking, and automated 4.0% loss circuit-breaker shutdown for funded accounts.",
    "duration_minutes": 18,
    "is_free": false,
    "content": ""
  },
  {
    "id": "lesson-5-3",
    "course_id": "00000000-0000-0000-0000-000000000005",
    "order_index": 20,
    "level_name": "Level 5: High School — The Safety Shield & Risk Architecture",
    "lesson_number": 3,
    "title": "Lesson 5.3: The Filter Stack (Execution Guards) 👓",
    "summary": "The 3-layer filter stack: Max Spread Guard, Trading Session Windows (London/NY), and the isNewBar single-execution guard.",
    "duration_minutes": 15,
    "is_free": false,
    "content": ""
  },
  {
    "id": "lesson-5-4",
    "course_id": "00000000-0000-0000-0000-000000000005",
    "order_index": 21,
    "level_name": "Level 5: High School — The Safety Shield & Risk Architecture",
    "lesson_number": 4,
    "title": "Lesson 5.4: Active Trade Management (Hands-Free Profit Protection) 🖐️",
    "summary": "Hands-free floating profit protection: Break-Even + Buffer, ATR Trailing Stops, and partial profit taking (scaling out).",
    "duration_minutes": 20,
    "is_free": false,
    "content": ""
  }
];

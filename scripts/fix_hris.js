const fs = require('fs');
let c = fs.readFileSync('src/lib/api/hris.ts', 'utf8');
const old = '     SelfAssessmentPayload\r\n       } from "./types/hrisTypes";';
const rep = '     SelfAssessmentPayload,\r\n         HrisDashboardData,\r\n         AttendanceMetric,\r\n        } from "./types/hrisTypes";\r\n\r\n// Re-export so consumers can import from "@/lib/api/hris" directly\r\nexport type { HrisDashboardData, AttendanceMetric };';
if (c.includes(old)) {
  c = c.replace(old, rep);
  fs.writeFileSync('src/lib/api/hris.ts', c, 'utf8');
  console.log('SUCCESS');
} else {
  console.log('NOT FOUND');
}

import re

with open('src/lib/api/hris.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Check what's around SelfAssessmentPayload
idx = content.find('SelfAssessmentPayload')
print('Context:', repr(content[idx-10:idx+80]))

old_crlf = '        SelfAssessmentPayload\r\n       } from "./types/hrisTypes";'
old_lf = '        SelfAssessmentPayload\n       } from "./types/hrisTypes";'

new_crlf = '        SelfAssessmentPayload,\r\n         HrisDashboardData,\r\n         AttendanceMetric,\r\n        } from "./types/hrisTypes";\r\n\r\n// Re-export so consumers can import from "@/lib/api/hris" directly\r\nexport type { HrisDashboardData, AttendanceMetric };'

new_lf = '        SelfAssessmentPayload,\n         HrisDashboardData,\n         AttendanceMetric,\n        } from "./types/hrisTypes";\n\n// Re-export so consumers can import from "@/lib/api/hris" directly\nexport type { HrisDashboardData, AttendanceMetric };'

if old_crlf in content:
    content = content.replace(old_crlf, new_crlf)
    print('Replaced CRLF')
elif old_lf in content:
    content = content.replace(old_lf, new_lf)
    print('Replaced LF')
else:
    print('NOT FOUND, searching...')
    # Find the actual text
    for line in content.split('\n'):
        if 'SelfAssessmentPayload' in line or 'hrisTypes' in line.split('"')[0:3:2]:
            print(repr(line))

with open('src/lib/api/hris.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')

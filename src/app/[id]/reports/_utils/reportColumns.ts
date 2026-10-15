import { CSSProperties } from 'react';
import { ReportColumnWidth } from '@/lib/data/fields';



// Report column uids from the company's report table settings
export const NAME_COLUMN = '55410'
export const SIGNATURE_COLUMN = '94583'

// Report columns share the page width in proportion to their configured size, so the
// manifest always fits the screen and a printed page. Fixed pixel sizes count as px / 10.
export function ReportColumnStyle(header: any): CSSProperties {
    const width = ReportColumnWidth(header.uid)
    const weight = width.endsWith('%') ? parseFloat(width) : parseFloat(width) / 10

    return { flex: `${weight || 10} 1 0%`, minWidth: 0 }
}

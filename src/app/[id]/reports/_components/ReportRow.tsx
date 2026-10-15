import { FC, useMemo } from 'react';
import ListRow from '@/app/[id]/_components/ListRow';
import { GetData } from '@/lib/data/getData';
import { NAME_COLUMN, ReportColumnStyle, SIGNATURE_COLUMN } from '../_utils/reportColumns';



interface Props {
    item: any
    columns: any[]
    clients: any[]
    drivers: any[]
}

// One trip on the driver manifest. Read-only; the signature column is left blank to sign on paper.
const ReportRow: FC<Props> = ({ item, columns, clients, drivers }) => {
    const data: any = useMemo(() => GetData('reports', item, columns, clients, drivers), [item, columns, clients, drivers])

    return (
        <ListRow
            columns={ columns }
            itemSpecs={ [] }
            primaryColumn={ NAME_COLUMN }
            getValue={ (header) => data[header.type !== 'ref' ? header.uid : header.options?.ref?.[0]?.value] }
            renderCell={ (header) => header.uid === SIGNATURE_COLUMN ? <span className='block h-5 w-full print:h-8'/> : undefined }
            columnStyle={ ReportColumnStyle }/>
    )
};


export default ReportRow;

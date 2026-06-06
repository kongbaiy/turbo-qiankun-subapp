import { ProColumns, ProTable } from '@ant-design/pro-components'
import CardTable from './card-table'

import { getApplications } from '@/api'
import {
    Applications,
    ApplicationRecord,
} from '@/api/application-components/application-manage/index.interface'

const columns: ProColumns<any>[] = [
    {
        title: '应用名称',
        dataIndex: 'keyword',
        width: 200,
        search: true,
    },
    {
        title: '平台编码',
        dataIndex: 'platformCode',
        width: 200,
        search: true,
    },
]

const Index = () => {
    const [loading, setLoading] = useState(false)
    const [records, setRecords] = useState<ApplicationRecord[]>([])
    const sendGetApplications = async (params: Applications) => {
        try {
            setLoading(true)
            const { data } = await getApplications(params)

            setRecords(data.records)
            return {
                success: true,
                data: data.records,
                total: data.total,
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <ProTable
                loading={loading}
                request={sendGetApplications}
                columns={columns}
                tableRender={() => <CardTable data={records} />}
            />
        </>
    )
}

export default Index

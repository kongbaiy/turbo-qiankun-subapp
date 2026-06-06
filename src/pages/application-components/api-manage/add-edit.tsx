import { Modal, ModalProps } from 'antd'
import {
    ProForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components'

import { saveApi } from '@/api/application-components/api-manage'
import type { SaveApi } from '@/api/application-components/api-manage/index.interface'

interface Props extends ModalProps {
    type: 'add' | 'edit'
    initialValues?: SaveApi
    onSuccess: () => void
}

const typeMap = {
    add: '新增接口',
    edit: '编辑接口',
}

const apiTypeOptions = [
    { label: 'RESTful', value: 'rest' },
    { label: 'WebSocket', value: 'websocket' },
    { label: 'gRPC', value: 'grpc' },
    { label: 'GraphQL', value: 'graphql' },
]

const methodOptions = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
    { label: 'WEBSOCKET', value: 'WEBSOCKET' },
]

const statusOptions = [
    { label: '启用', value: 1 },
    { label: '停用', value: 0 },
]

const Index = (props: Props) => {
    const [form] = ProForm.useForm()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (props.initialValues && props.type === 'edit') {
            form.setFieldsValue(props.initialValues)
        } else {
            form.resetFields()
            form.setFieldsValue({
                status: 1,
                sortNo: 100,
                method: 'GET',
                apiType: 'rest',
            })
        }
    }, [props.initialValues, props.type, form])

    const handleOk = async () => {
        await form.validateFields()
        const values = form.getFieldsValue()
        await sendSaveApi(values)
    }

    const sendSaveApi = async (params: SaveApi) => {
        try {
            setLoading(true)
            await saveApi(params)
            props.onSuccess()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            title={typeMap[props.type]}
            open={true}
            onOk={handleOk}
            onCancel={props.onCancel}
            okText='确认'
            cancelText='取消'
            width={700}
            loading={loading}
        >
            <ProForm<SaveApi> form={form} layout='vertical' submitter={false}>
                <ProFormText
                    name='apiName'
                    label='接口名称'
                    rules={[{ required: true, message: '请输入接口名称' }]}
                    placeholder='请输入接口名称'
                />
                <ProFormText
                    name='apiPath'
                    label='接口路径'
                    rules={[{ required: true, message: '请输入接口路径' }]}
                    placeholder='例如: /admin/basic/users'
                />
                <ProFormSelect
                    name='apiType'
                    label='接口类型'
                    rules={[{ required: true, message: '请选择接口类型' }]}
                    options={apiTypeOptions}
                    placeholder='请选择接口类型'
                />
                <ProFormSelect
                    name='method'
                    label='请求方式'
                    rules={[{ required: true, message: '请选择请求方式' }]}
                    options={methodOptions}
                    placeholder='请选择请求方式'
                />
                <ProFormTextArea
                    name='description'
                    label='接口描述'
                    placeholder='请输入接口描述'
                    fieldProps={{
                        rows: 3,
                    }}
                />
                <ProFormTextArea
                    name='requestSchema'
                    label='请求参数 Schema'
                    placeholder='请输入请求参数的 JSON Schema 定义'
                    fieldProps={{
                        rows: 4,
                    }}
                />
                <ProFormTextArea
                    name='responseSchema'
                    label='响应参数 Schema'
                    placeholder='请输入响应参数的 JSON Schema 定义'
                    fieldProps={{
                        rows: 4,
                    }}
                />
                <ProFormText
                    name='sortNo'
                    label='排序号'
                    rules={[{ required: true, message: '请输入排序号' }]}
                    placeholder='例如: 100'
                />
                <ProFormSelect
                    name='status'
                    label='状态'
                    rules={[{ required: true, message: '请选择状态' }]}
                    options={statusOptions}
                    placeholder='请选择状态'
                />
            </ProForm>
        </Modal>
    )
}

export default Index

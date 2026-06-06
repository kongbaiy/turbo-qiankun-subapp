import { Modal, ModalProps } from 'antd'
import {
    ProForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components'

import { saveDimensionType } from '@/api/global-data-standard/dimension-manage'
import type { SaveDimensionType } from '@/api/global-data-standard/dimension-manage/index.interface'

interface Props extends ModalProps {
    type: 'add' | 'edit'
    initialValues?: SaveDimensionType
    onSuccess: () => void
}

const typeMap = {
    add: '新增维度类型',
    edit: '编辑维度类型',
}

const isSystemOptions = [
    { label: '是', value: 1 },
    { label: '否', value: 0 },
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
            form.setFieldsValue({ status: 1, isSystem: 0, sortNo: 100 })
        }
    }, [props.initialValues, props.type, form])

    const handleOk = async () => {
        await form.validateFields()
        const values = form.getFieldsValue()
        await sendSaveType(values)
    }

    const sendSaveType = async (params: SaveDimensionType) => {
        try {
            setLoading(true)
            await saveDimensionType(params)
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
            width={600}
            loading={loading}
        >
            <ProForm<SaveDimensionType>
                form={form}
                layout='vertical'
                submitter={false}
            >
                <ProFormText
                    name='typeCode'
                    label='维度类型编码'
                    rules={[{ required: true, message: '请输入维度类型编码' }]}
                    placeholder='例如: ORG, REGION, BIZ_LINE'
                />
                <ProFormText
                    name='typeName'
                    label='维度类型名称'
                    rules={[{ required: true, message: '请输入维度类型名称' }]}
                    placeholder='例如: 组织维度, 地区维度'
                />
                <ProFormTextArea
                    name='description'
                    label='描述'
                    placeholder='请输入维度类型描述'
                    fieldProps={{
                        rows: 3,
                    }}
                />
                <ProFormSelect
                    name='isSystem'
                    label='系统维度'
                    rules={[{ required: true, message: '请选择是否为系统维度' }]}
                    options={isSystemOptions}
                    placeholder='请选择是否为系统维度'
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

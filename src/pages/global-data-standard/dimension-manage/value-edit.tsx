import { Modal, ModalProps } from 'antd'
import {
    ProForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProFormTreeSelect,
} from '@ant-design/pro-components'

import { saveDimensionValue } from '@/api/global-data-standard/dimension-manage'
import type { SaveDimensionValue } from '@/api/global-data-standard/dimension-manage/index.interface'

interface Props extends ModalProps {
    type: 'add' | 'edit'
    typeId: string
    parentOptions: any[]
    initialValues?: SaveDimensionValue
    onSuccess: () => void
}

const typeMap = {
    add: '新增维度值',
    edit: '编辑维度值',
}

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
                typeId: props.typeId,
                status: 1,
                sortNo: 100,
            })
        }
    }, [props.initialValues, props.type, props.typeId, form])

    const handleOk = async () => {
        await form.validateFields()
        const values = form.getFieldsValue()
        await sendSaveValue(values)
    }

    const sendSaveValue = async (params: SaveDimensionValue) => {
        try {
            setLoading(true)
            await saveDimensionValue(params)
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
            <ProForm<SaveDimensionValue>
                form={form}
                layout='vertical'
                submitter={false}
            >
                <ProFormText
                    name='valueCode'
                    label='维度值编码'
                    rules={[{ required: true, message: '请输入维度值编码' }]}
                    placeholder='例如: HEADQUARTERS, BRANCH'
                />
                <ProFormText
                    name='valueName'
                    label='维度值名称'
                    rules={[{ required: true, message: '请输入维度值名称' }]}
                    placeholder='例如: 总部, 分公司'
                />
                <ProFormTreeSelect
                    name='parentId'
                    label='上级维度'
                    placeholder='请选择上级维度（可选）'
                    fieldProps={{
                        treeData: props.parentOptions,
                        allowClear: true,
                    }}
                />
                <ProFormTextArea
                    name='description'
                    label='描述'
                    placeholder='请输入维度值描述'
                    fieldProps={{
                        rows: 3,
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

import { Modal, ModalProps } from 'antd'
import {
    ProForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components'

import { saveComponent } from '@/api/application-components/component-manage'
import type { SaveComponent } from '@/api/application-components/component-manage/index.interface'

interface Props extends ModalProps {
    type: 'add' | 'edit'
    initialValues?: SaveComponent
    onSuccess: () => void
}

const typeMap = {
    add: '新增组件',
    edit: '编辑组件',
}

const componentTypeOptions = [
    { label: 'UI组件', value: 'ui' },
    { label: '业务组件', value: 'business' },
    { label: '布局组件', value: 'layout' },
    { label: '表单组件', value: 'form' },
    { label: '图表组件', value: 'chart' },
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
            form.setFieldsValue({ status: 1, sortNo: 100 })
        }
    }, [props.initialValues, props.type, form])

    const handleOk = async () => {
        await form.validateFields()
        const values = form.getFieldsValue()
        await sendSaveComponent(values)
    }

    const sendSaveComponent = async (params: SaveComponent) => {
        try {
            setLoading(true)
            await saveComponent(params)
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
            <ProForm<SaveComponent>
                form={form}
                layout='vertical'
                submitter={false}
            >
                <ProFormText
                    name='componentName'
                    label='组件名称'
                    rules={[{ required: true, message: '请输入组件名称' }]}
                    placeholder='请输入组件名称'
                />
                <ProFormText
                    name='componentCode'
                    label='组件编码'
                    rules={[{ required: true, message: '请输入组件编码' }]}
                    placeholder='例如: ScButton, ScTable'
                />
                <ProFormSelect
                    name='componentType'
                    label='组件类型'
                    rules={[{ required: true, message: '请选择组件类型' }]}
                    options={componentTypeOptions}
                    placeholder='请选择组件类型'
                />
                <ProFormTextArea
                    name='description'
                    label='组件描述'
                    placeholder='请输入组件描述'
                    fieldProps={{
                        rows: 3,
                    }}
                />
                <ProFormTextArea
                    name='propsSchema'
                    label='Props Schema'
                    placeholder='请输入组件 Props 的 JSON Schema 定义'
                    fieldProps={{
                        rows: 4,
                    }}
                />
                <ProFormTextArea
                    name='defaultProps'
                    label='默认 Props'
                    placeholder='请输入组件默认 Props 的 JSON 定义'
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

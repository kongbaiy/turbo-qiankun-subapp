import { Modal, ModalProps } from 'antd'
import {
    ProForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components'

import { saveDictCategory } from '@/api/global-data-standard/dict-manage'
import type { SaveDictCategory } from '@/api/global-data-standard/dict-manage/index.interface'

interface Props extends ModalProps {
    type: 'add' | 'edit'
    initialValues?: SaveDictCategory
    onSuccess: () => void
}

const typeMap = {
    add: '新增字典分类',
    edit: '编辑字典分类',
}

const allowExtendOptions = [
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
            form.setFieldsValue({ status: 1, allowExtend: 0, sortNo: 100 })
        }
    }, [props.initialValues, props.type, form])

    const handleOk = async () => {
        await form.validateFields()
        const values = form.getFieldsValue()
        await sendSaveCategory(values)
    }

    const sendSaveCategory = async (params: SaveDictCategory) => {
        try {
            setLoading(true)
            await saveDictCategory(params)
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
            <ProForm<SaveDictCategory>
                form={form}
                layout='vertical'
                submitter={false}
            >
                <ProFormText
                    name='categoryCode'
                    label='分类编码'
                    rules={[{ required: true, message: '请输入分类编码' }]}
                    placeholder='例如: GENDER, ORDER_STATUS'
                />
                <ProFormText
                    name='categoryName'
                    label='分类名称'
                    rules={[{ required: true, message: '请输入分类名称' }]}
                    placeholder='例如: 性别, 订单状态'
                />
                <ProFormTextArea
                    name='description'
                    label='描述'
                    placeholder='请输入分类描述'
                    fieldProps={{
                        rows: 3,
                    }}
                />
                <ProFormSelect
                    name='allowExtend'
                    label='允许租户扩展'
                    rules={[{ required: true, message: '请选择是否允许扩展' }]}
                    options={allowExtendOptions}
                    placeholder='请选择是否允许租户扩展'
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

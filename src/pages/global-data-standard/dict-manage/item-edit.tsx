import { Modal, ModalProps } from 'antd'
import {
    ProForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProFormTreeSelect,
} from '@ant-design/pro-components'

import { saveDictItem } from '@/api/global-data-standard/dict-manage'
import type { SaveDictItem } from '@/api/global-data-standard/dict-manage/index.interface'

interface Props extends ModalProps {
    type: 'add' | 'edit'
    categoryId: string
    parentOptions: any[]
    initialValues?: SaveDictItem
    onSuccess: () => void
}

const typeMap = {
    add: '新增字典项',
    edit: '编辑字典项',
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
                categoryId: props.categoryId,
                status: 1,
                sortNo: 100,
            })
        }
    }, [props.initialValues, props.type, props.categoryId, form])

    const handleOk = async () => {
        await form.validateFields()
        const values = form.getFieldsValue()
        await sendSaveItem(values)
    }

    const sendSaveItem = async (params: SaveDictItem) => {
        try {
            setLoading(true)
            await saveDictItem(params)
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
            <ProForm<SaveDictItem>
                form={form}
                layout='vertical'
                submitter={false}
            >
                <ProFormText
                    name='itemCode'
                    label='字典编码'
                    rules={[{ required: true, message: '请输入字典编码' }]}
                    placeholder='例如: MALE, FEMALE'
                />
                <ProFormText
                    name='itemName'
                    label='字典名称'
                    rules={[{ required: true, message: '请输入字典名称' }]}
                    placeholder='例如: 男, 女'
                />
                <ProFormText
                    name='itemValue'
                    label='字典值'
                    placeholder='例如: 1, 0'
                />
                <ProFormTreeSelect
                    name='parentId'
                    label='上级字典'
                    placeholder='请选择上级字典（可选）'
                    fieldProps={{
                        treeData: props.parentOptions,
                        allowClear: true,
                    }}
                />
                <ProFormTextArea
                    name='description'
                    label='描述'
                    placeholder='请输入字典项描述'
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

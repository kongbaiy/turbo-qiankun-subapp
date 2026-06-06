import { Modal, ModalProps } from 'antd'
import {
    ProForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProFormDigit,
} from '@ant-design/pro-components'

import { saveSerial } from '@/api/global-data-standard/serial-manage'
import type { SaveSerial } from '@/api/global-data-standard/serial-manage/index.interface'

interface Props extends ModalProps {
    type: 'add' | 'edit'
    initialValues?: SaveSerial
    onSuccess: () => void
}

const typeMap = {
    add: '新增流水号',
    edit: '编辑流水号',
}

const resetTypeOptions = [
    { label: '不重置', value: 'none' },
    { label: '按日重置', value: 'day' },
    { label: '按月重置', value: 'month' },
    { label: '按年重置', value: 'year' },
]

const dateFormatOptions = [
    { label: 'yyyyMMdd', value: 'yyyyMMdd' },
    { label: 'yyyyMM', value: 'yyyyMM' },
    { label: 'yyyy', value: 'yyyy' },
    { label: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
    { label: 'yyyy-MM', value: 'yyyy-MM' },
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
                digitLength: 4,
                startValue: 1,
                step: 1,
                resetType: 'none',
                sortNo: 100,
            })
        }
    }, [props.initialValues, props.type, form])

    const handleOk = async () => {
        await form.validateFields()
        const values = form.getFieldsValue()
        await sendSaveSerial(values)
    }

    const sendSaveSerial = async (params: SaveSerial) => {
        try {
            setLoading(true)
            await saveSerial(params)
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
            <ProForm<SaveSerial>
                form={form}
                layout='vertical'
                submitter={false}
            >
                <ProFormText
                    name='serialCode'
                    label='流水号编码'
                    rules={[{ required: true, message: '请输入流水号编码' }]}
                    placeholder='例如: ORDER_NO, CONTRACT_NO'
                />
                <ProFormText
                    name='serialName'
                    label='流水号名称'
                    rules={[{ required: true, message: '请输入流水号名称' }]}
                    placeholder='例如: 订单编号, 合同编号'
                />
                <ProFormText
                    name='prefix'
                    label='前缀'
                    placeholder='例如: ORD, CT'
                />
                <ProFormSelect
                    name='dateFormat'
                    label='日期格式'
                    options={dateFormatOptions}
                    placeholder='请选择日期格式（可选）'
                />
                <ProFormDigit
                    name='digitLength'
                    label='流水位数'
                    rules={[{ required: true, message: '请输入流水位数' }]}
                    placeholder='例如: 4'
                    min={1}
                    max={10}
                />
                <ProFormDigit
                    name='startValue'
                    label='起始值'
                    rules={[{ required: true, message: '请输入起始值' }]}
                    placeholder='例如: 1'
                    min={0}
                />
                <ProFormDigit
                    name='step'
                    label='步长'
                    rules={[{ required: true, message: '请输入步长' }]}
                    placeholder='例如: 1'
                    min={1}
                />
                <ProFormText
                    name='suffix'
                    label='后缀'
                    placeholder='例如: -A, -B'
                />
                <ProFormSelect
                    name='resetType'
                    label='重置规则'
                    rules={[{ required: true, message: '请选择重置规则' }]}
                    options={resetTypeOptions}
                    placeholder='请选择重置规则'
                />
                <ProFormTextArea
                    name='description'
                    label='描述'
                    placeholder='请输入流水号规则描述'
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

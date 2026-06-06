import { Modal, ModalProps } from 'antd'
import { ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components'

import { savePlatform } from '@/api/application-components/platform-manage'
import type { SavePlatform } from '@/api/application-components/platform-manage/index.interface'

interface Props extends ModalProps {
    type: 'add' | 'edit'
    initialValues?: SavePlatform
    onSuccess: () => void
}
const typeMap = {
    add: '新增平台',
    edit: '编辑平台',
}

const Index = (props: Props) => {
    const [form] = ProForm.useForm()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (props.initialValues && props.type === 'edit') {
            form.setFieldsValue(props.initialValues)
        }
    }, [props.initialValues, props.type])

    const handleOk = async () => {
        await form.validateFields()
        const values = form.getFieldsValue()
        await sendSavePlatform(values)
    }

    const sendSavePlatform = async (params: SavePlatform) => {
        try {
            setLoading(true)
            await savePlatform(params)
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
            <ProForm<SavePlatform>
                form={form}
                layout='vertical'
                submitter={false}
            >
                <ProFormText
                    name='platformName'
                    label='平台名称'
                    rules={[{ required: true, message: '请输入平台名称' }]}
                    placeholder='请输入平台名称'
                />
                <ProFormText
                    name='platformCode'
                    label='平台编码'
                    rules={[{ required: true, message: '请输入平台编码' }]}
                    placeholder='例如: PLATFORM_PC'
                />
                <ProFormText
                    name='clientType'
                    label='客户端类型'
                    rules={[{ required: true, message: '请输入客户端类型' }]}
                    placeholder='例如: CLIENT_PC, CLIENT_MOBILE, CLIENT_WEB, CLIENT_APP'
                />
                <ProFormText
                    name='entryUrl'
                    label='入口地址'
                    rules={[{ required: true, message: '请输入入口地址' }]}
                    placeholder='例如: http://localhost:3001'
                />
                <ProFormSelect
                    name='loginMethods'
                    label='登录方式'
                    rules={[{ required: true, message: '请选择登录方式' }]}
                    options={[
                        { label: '账号密码', value: 'password' },
                        { label: '手机验证码', value: 'sms' },
                    ]}
                    placeholder='请选择登录方式'
                />
                <ProFormText
                    name='sortNo'
                    label='排序号'
                    rules={[{ required: true, message: '请输入排序号' }]}
                    placeholder='例如: 100'
                />
                <ProFormSelect
                    name='platformStatus'
                    label='平台状态'
                    initialValue='1'
                    rules={[{ required: true, message: '请选择平台状态' }]}
                    options={[
                        { label: '启用', value: '1' },
                        { label: '停用', value: '0' },
                    ]}
                />
                <ProFormText
                    name='version'
                    label='版本号'
                    rules={[{ required: true, message: '请输入版本号' }]}
                />
            </ProForm>
        </Modal>
    )
}

export default Index

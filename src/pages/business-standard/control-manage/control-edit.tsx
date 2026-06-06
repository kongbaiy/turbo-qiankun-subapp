import { useState, useEffect } from 'react'
import { Modal, ModalProps, Tabs, message } from 'antd'
import {
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
    ProFormDigit,
} from '@ant-design/pro-components'

import { saveControl } from '@/api/business-standard/control-manage'
import type { SaveControl } from '@/api/business-standard/control-manage/index.interface'

interface Props extends ModalProps {
    type: 'add' | 'edit'
    initialValues?: SaveControl
    onSuccess: () => void
}

const typeMap = {
    add: '新增控件',
    edit: '编辑控件',
}

const controlTypeOptions = [
    { label: '基础控件', value: 'basic' },
    { label: '高级控件', value: 'advanced' },
    { label: '业务控件', value: 'business' },
]

const controlCategoryOptions = [
    { label: '文本', value: 'text' },
    { label: '数值', value: 'number' },
    { label: '选择', value: 'select' },
    { label: '日期时间', value: 'datetime' },
    { label: '文件媒体', value: 'file' },
    { label: '其他交互', value: 'other' },
    { label: '关联选择', value: 'relation' },
    { label: '数据展示', value: 'display' },
    { label: '地图定位', value: 'map' },
    { label: '计算衍生', value: 'compute' },
    { label: '第三方集成', value: 'thirdparty' },
    { label: '组织架构', value: 'org' },
    { label: '预算管理', value: 'budget' },
    { label: '财务核算', value: 'finance' },
    { label: '供应链', value: 'supply' },
]

const statusOptions = [
    { label: '启用', value: 1 },
    { label: '停用', value: 0 },
]

const Index = (props: Props) => {
    const [form] = ProForm.useForm()
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('basic')

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
        await sendSaveControl(values)
    }

    const sendSaveControl = async (params: SaveControl) => {
        try {
            setLoading(true)
            await saveControl(params)
            message.success(props.type === 'add' ? '新增成功' : '编辑成功')
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
            width={800}
            confirmLoading={loading}
        >
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <Tabs.TabPane tab='基础信息' key='basic'>
                    <ProForm<SaveControl>
                        form={form}
                        layout='vertical'
                        submitter={false}
                    >
                        <ProFormText
                            name='controlName'
                            label='控件名称'
                            rules={[
                                { required: true, message: '请输入控件名称' },
                            ]}
                            placeholder='请输入控件名称'
                        />
                        <ProFormText
                            name='controlCode'
                            label='控件编码'
                            rules={[
                                { required: true, message: '请输入控件编码' },
                            ]}
                            placeholder='例如: ScInput, ScSelect'
                        />
                        <ProFormSelect
                            name='controlType'
                            label='控件类型'
                            rules={[
                                { required: true, message: '请选择控件类型' },
                            ]}
                            options={controlTypeOptions}
                            placeholder='请选择控件类型'
                        />
                        <ProFormSelect
                            name='controlCategory'
                            label='控件分类'
                            rules={[
                                { required: true, message: '请选择控件分类' },
                            ]}
                            options={controlCategoryOptions}
                            placeholder='请选择控件分类'
                        />
                        <ProFormText
                            name='icon'
                            label='控件图标'
                            placeholder='例如: InputOutlined'
                        />
                        <ProFormTextArea
                            name='description'
                            label='控件描述'
                            placeholder='请输入控件描述'
                            fieldProps={{ rows: 3 }}
                        />
                        <ProFormDigit
                            name='sortNo'
                            label='排序号'
                            rules={[
                                { required: true, message: '请输入排序号' },
                            ]}
                            placeholder='例如: 100'
                            min={0}
                        />
                        <ProFormSelect
                            name='status'
                            label='状态'
                            rules={[{ required: true, message: '请选择状态' }]}
                            options={statusOptions}
                            placeholder='请选择状态'
                        />
                    </ProForm>
                </Tabs.TabPane>
            </Tabs>
        </Modal>
    )
}

export default Index

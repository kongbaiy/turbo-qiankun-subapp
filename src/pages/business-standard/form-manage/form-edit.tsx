import { useState, useEffect } from 'react'
import { Modal, ModalProps, message } from 'antd'
import {
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormTextArea,
    ProFormDigit,
} from '@ant-design/pro-components'

import { saveForm } from '@/api/business-standard/form-manage'
import type { SaveForm } from '@/api/business-standard/form-manage/index.interface'

interface Props extends ModalProps {
    type: 'add' | 'edit'
    initialValues?: SaveForm
    onSuccess: () => void
}

const typeMap = {
    add: '新增表单',
    edit: '编辑表单',
}

const formTypeOptions = [
    { label: '应用表单', value: 'application' },
    { label: '流程表单', value: 'process' },
    { label: '集成表单', value: 'integration' },
]

const accessLevelOptions = [
    { label: '公开', value: 'public' },
    { label: '内部', value: 'internal' },
    { label: '机密', value: 'confidential' },
    { label: '绝密', value: 'secret' },
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
                dataAccessLevel: 'internal',
            })
        }
    }, [props.initialValues, props.type, form])

    const handleOk = async () => {
        await form.validateFields()
        const values = form.getFieldsValue()
        await sendSaveForm(values)
    }

    const sendSaveForm = async (params: SaveForm) => {
        try {
            setLoading(true)
            await saveForm(params)
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
            width={700}
            confirmLoading={loading}
        >
            <ProForm<SaveForm> form={form} layout='vertical' submitter={false}>
                <ProFormText
                    name='formName'
                    label='表单名称'
                    rules={[{ required: true, message: '请输入表单名称' }]}
                    placeholder='请输入表单名称'
                />
                <ProFormText
                    name='formCode'
                    label='表单编码'
                    rules={[{ required: true, message: '请输入表单编码' }]}
                    placeholder='例如: OrderForm, LeaveForm'
                />
                <ProFormSelect
                    name='formType'
                    label='表单类型'
                    rules={[{ required: true, message: '请选择表单类型' }]}
                    options={formTypeOptions}
                    placeholder='请选择表单类型'
                />
                <ProFormSelect
                    name='dataAccessLevel'
                    label='数据访问定级'
                    rules={[{ required: true, message: '请选择数据访问定级' }]}
                    options={accessLevelOptions}
                    placeholder='请选择数据访问定级'
                />
                <ProFormTextArea
                    name='description'
                    label='表单描述'
                    placeholder='请输入表单描述'
                    fieldProps={{ rows: 3 }}
                />
                <ProFormDigit
                    name='sortNo'
                    label='排序号'
                    rules={[{ required: true, message: '请输入排序号' }]}
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
        </Modal>
    )
}

export default Index

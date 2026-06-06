import { useState, useEffect } from 'react'
import { Modal, Button, Table, Input, Select, Switch, message } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

import { saveForm } from '@/api/business-standard/form-manage'
import type {
    FormRecord,
    FormField,
    SaveForm,
} from '@/api/business-standard/form-manage/index.interface'

interface Props {
    open: boolean
    formRecord: FormRecord
    onClose: () => void
}

const fieldTypeOptions = [
    { label: '字符串', value: 'string' },
    { label: '数值', value: 'number' },
    { label: '布尔', value: 'boolean' },
    { label: '日期', value: 'date' },
    { label: '日期时间', value: 'datetime' },
    { label: '文本', value: 'text' },
]

const controlTypeOptions = [
    { label: '单行文本', value: 'input' },
    { label: '多行文本', value: 'textarea' },
    { label: '数字', value: 'number' },
    { label: '单选框', value: 'radio' },
    { label: '复选框', value: 'checkbox' },
    { label: '下拉选择', value: 'select' },
    { label: '日期选择', value: 'datepicker' },
    { label: '文件上传', value: 'upload' },
]

const accessLevelOptions = [
    { label: '公开', value: 'public' },
    { label: '内部', value: 'internal' },
    { label: '机密', value: 'confidential' },
    { label: '绝密', value: 'secret' },
]

const Index = (props: Props) => {
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState<FormField[]>([])

    useEffect(() => {
        if (props.formRecord) {
            setFields(props.formRecord.fields || [])
        }
    }, [props.formRecord])

    const handleAddField = () => {
        const newField: FormField = {
            id: `temp_${Date.now()}`,
            fieldName: '',
            fieldCode: '',
            fieldType: 'string',
            controlType: 'input',
            required: false,
            dataAccessLevel: 'internal',
            sortNo: fields.length + 1,
        }
        setFields([...fields, newField])
    }

    const handleRemoveField = (index: number) => {
        const newFields = [...fields]
        newFields.splice(index, 1)
        setFields(newFields)
    }

    const handleFieldChange = (
        index: number,
        field: keyof FormField,
        value: any,
    ) => {
        const newFields = [...fields]
        newFields[index] = { ...newFields[index], [field]: value } as FormField
        setFields(newFields)
    }

    const handleSave = async () => {
        try {
            setLoading(true)
            const params: SaveForm = {
                id: props.formRecord.id,
                formName: props.formRecord.formName,
                formCode: props.formRecord.formCode,
                formType: props.formRecord.formType,
                description: props.formRecord.description,
                dataAccessLevel: props.formRecord.dataAccessLevel,
                fields,
                extendProps: props.formRecord.extendProps,
                sortNo: props.formRecord.sortNo,
                status: props.formRecord.status,
                version: props.formRecord.version,
            }
            await saveForm(params)
            message.success('保存成功')
            props.onClose()
        } finally {
            setLoading(false)
        }
    }

    const columns = [
        {
            title: '字段名称',
            dataIndex: 'fieldName',
            width: 160,
            render: (_: any, __: any, index: number) => (
                <Input
                    value={fields[index]?.fieldName}
                    onChange={(e) =>
                        handleFieldChange(index, 'fieldName', e.target.value)
                    }
                    placeholder='字段名称'
                />
            ),
        },
        {
            title: '字段编码',
            dataIndex: 'fieldCode',
            width: 160,
            render: (_: any, __: any, index: number) => (
                <Input
                    value={fields[index]?.fieldCode}
                    onChange={(e) =>
                        handleFieldChange(index, 'fieldCode', e.target.value)
                    }
                    placeholder='字段编码'
                />
            ),
        },
        {
            title: '字段类型',
            dataIndex: 'fieldType',
            width: 120,
            render: (_: any, __: any, index: number) => (
                <Select
                    value={fields[index]?.fieldType}
                    options={fieldTypeOptions}
                    onChange={(value) =>
                        handleFieldChange(index, 'fieldType', value)
                    }
                    style={{ width: 120 }}
                />
            ),
        },
        {
            title: '控件类型',
            dataIndex: 'controlType',
            width: 120,
            render: (_: any, __: any, index: number) => (
                <Select
                    value={fields[index]?.controlType}
                    options={controlTypeOptions}
                    onChange={(value) =>
                        handleFieldChange(index, 'controlType', value)
                    }
                    style={{ width: 120 }}
                />
            ),
        },
        {
            title: '访问定级',
            dataIndex: 'dataAccessLevel',
            width: 100,
            render: (_: any, __: any, index: number) => (
                <Select
                    value={fields[index]?.dataAccessLevel}
                    options={accessLevelOptions}
                    onChange={(value) =>
                        handleFieldChange(index, 'dataAccessLevel', value)
                    }
                    style={{ width: 100 }}
                />
            ),
        },
        {
            title: '必填',
            dataIndex: 'required',
            width: 70,
            render: (_: any, __: any, index: number) => (
                <Switch
                    checked={fields[index]?.required}
                    onChange={(checked) =>
                        handleFieldChange(index, 'required', checked)
                    }
                />
            ),
        },
        {
            title: '操作',
            width: 80,
            render: (_: any, __: any, index: number) => (
                <Button
                    type='link'
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveField(index)}
                >
                    删除
                </Button>
            ),
        },
    ]

    return (
        <Modal
            title={`${props.formRecord.formName} - 字段管理`}
            open={props.open}
            onOk={handleSave}
            onCancel={props.onClose}
            okText='保存'
            cancelText='取消'
            width={1100}
            confirmLoading={loading}
        >
            <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={handleAddField}
                style={{ marginBottom: 16 }}
            >
                新增字段
            </Button>
            <Table
                dataSource={fields}
                columns={columns}
                rowKey='id'
                pagination={false}
                size='small'
                scroll={{ x: 900 }}
            />
        </Modal>
    )
}

export default Index

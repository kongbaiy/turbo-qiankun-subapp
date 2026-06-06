import { useState, useEffect } from 'react'
import { Modal, Button, Table, Input, Select, Switch, message } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

import { saveForm } from '@/api/business-standard/form-manage'
import type {
    FormRecord,
    FormExtendProp,
    SaveForm,
} from '@/api/business-standard/form-manage/index.interface'

interface Props {
    open: boolean
    record: FormRecord
    onClose: () => void
}

const propTypeOptions = [
    { label: '字符串', value: 'string' },
    { label: '数值', value: 'number' },
    { label: '布尔', value: 'boolean' },
    { label: '数组', value: 'array' },
    { label: '对象', value: 'object' },
    { label: '枚举', value: 'enum' },
]

const Index = (props: Props) => {
    const [loading, setLoading] = useState(false)
    const [extendProps, setExtendProps] = useState<FormExtendProp[]>([])

    useEffect(() => {
        if (props.record) {
            setExtendProps(props.record.extendProps || [])
        }
    }, [props.record])

    const handleAddProp = () => {
        setExtendProps([
            ...extendProps,
            {
                propName: '',
                propCode: '',
                propType: 'string',
                defaultValue: '',
                required: false,
                description: '',
            },
        ])
    }

    const handleRemoveProp = (index: number) => {
        const newProps = [...extendProps]
        newProps.splice(index, 1)
        setExtendProps(newProps)
    }

    const handlePropChange = (
        index: number,
        field: keyof FormExtendProp,
        value: any,
    ) => {
        const newProps = [...extendProps]
        newProps[index] = {
            ...newProps[index],
            [field]: value,
        } as FormExtendProp
        setExtendProps(newProps)
    }

    const handleSave = async () => {
        try {
            setLoading(true)
            const params: SaveForm = {
                id: props.record.id,
                formName: props.record.formName,
                formCode: props.record.formCode,
                formType: props.record.formType,
                description: props.record.description,
                dataAccessLevel: props.record.dataAccessLevel,
                fields: props.record.fields,
                extendProps,
                sortNo: props.record.sortNo,
                status: props.record.status,
                version: props.record.version,
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
            title: '属性名称',
            dataIndex: 'propName',
            render: (_: any, __: any, index: number) => (
                <Input
                    value={extendProps[index]?.propName}
                    onChange={(e) =>
                        handlePropChange(index, 'propName', e.target.value)
                    }
                    placeholder='属性名称'
                />
            ),
        },
        {
            title: '属性编码',
            dataIndex: 'propCode',
            render: (_: any, __: any, index: number) => (
                <Input
                    value={extendProps[index]?.propCode}
                    onChange={(e) =>
                        handlePropChange(index, 'propCode', e.target.value)
                    }
                    placeholder='属性编码'
                />
            ),
        },
        {
            title: '属性类型',
            dataIndex: 'propType',
            render: (_: any, __: any, index: number) => (
                <Select
                    value={extendProps[index]?.propType}
                    options={propTypeOptions}
                    onChange={(value) =>
                        handlePropChange(index, 'propType', value)
                    }
                    style={{ width: 120 }}
                />
            ),
        },
        {
            title: '默认值',
            dataIndex: 'defaultValue',
            render: (_: any, __: any, index: number) => (
                <Input
                    value={extendProps[index]?.defaultValue}
                    onChange={(e) =>
                        handlePropChange(index, 'defaultValue', e.target.value)
                    }
                    placeholder='默认值'
                />
            ),
        },
        {
            title: '必填',
            dataIndex: 'required',
            render: (_: any, __: any, index: number) => (
                <Switch
                    checked={extendProps[index]?.required}
                    onChange={(checked) =>
                        handlePropChange(index, 'required', checked)
                    }
                />
            ),
        },
        {
            title: '操作',
            render: (_: any, __: any, index: number) => (
                <Button
                    type='link'
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveProp(index)}
                >
                    删除
                </Button>
            ),
        },
    ]

    return (
        <Modal
            title={`${props.record.formName} - 扩展属性配置`}
            open={props.open}
            onOk={handleSave}
            onCancel={props.onClose}
            okText='保存'
            cancelText='取消'
            width={900}
            confirmLoading={loading}
        >
            <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={handleAddProp}
                style={{ marginBottom: 16 }}
            >
                新增扩展属性
            </Button>
            <Table
                dataSource={extendProps}
                columns={columns}
                rowKey={(_, index) => `prop-${index}`}
                pagination={false}
                size='small'
            />
        </Modal>
    )
}

export default Index

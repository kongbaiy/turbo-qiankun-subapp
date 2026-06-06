import { useState, useEffect } from 'react'
import {
    Modal,
    Button,
    Table,
    Input,
    Select,
    Switch,
    Space,
    message,
} from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

import { saveControl } from '@/api/business-standard/control-manage'
import type {
    ControlRecord,
    ControlBaseProp,
    ControlExtendProp,
    SaveControl,
} from '@/api/business-standard/control-manage/index.interface'

interface Props {
    open: boolean
    record: ControlRecord
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
    const [baseProps, setBaseProps] = useState<ControlBaseProp[]>([])
    const [extendProps, setExtendProps] = useState<ControlExtendProp[]>([])
    const [activeTab, setActiveTab] = useState<'base' | 'extend'>('base')

    useEffect(() => {
        if (props.record) {
            setBaseProps(props.record.baseProps || [])
            setExtendProps(props.record.extendProps || [])
        }
    }, [props.record])

    const handleAddBaseProp = () => {
        setBaseProps([
            ...baseProps,
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

    const handleAddExtendProp = () => {
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

    const handleRemoveBaseProp = (index: number) => {
        const newProps = [...baseProps]
        newProps.splice(index, 1)
        setBaseProps(newProps)
    }

    const handleRemoveExtendProp = (index: number) => {
        const newProps = [...extendProps]
        newProps.splice(index, 1)
        setExtendProps(newProps)
    }

    const handleBasePropChange = (
        index: number,
        field: keyof ControlBaseProp,
        value: any,
    ) => {
        const newProps = [...baseProps]
        newProps[index] = {
            ...newProps[index],
            [field]: value,
        } as ControlBaseProp
        setBaseProps(newProps)
    }

    const handleExtendPropChange = (
        index: number,
        field: keyof ControlExtendProp,
        value: any,
    ) => {
        const newProps = [...extendProps]
        newProps[index] = {
            ...newProps[index],
            [field]: value,
        } as ControlExtendProp
        setExtendProps(newProps)
    }

    const handleSave = async () => {
        try {
            setLoading(true)
            const params: SaveControl = {
                id: props.record.id,
                controlName: props.record.controlName,
                controlCode: props.record.controlCode,
                controlType: props.record.controlType,
                controlCategory: props.record.controlCategory,
                description: props.record.description,
                icon: props.record.icon,
                baseProps,
                extendProps,
                sortNo: props.record.sortNo,
                status: props.record.status,
                version: props.record.version,
            }
            await saveControl(params)
            message.success('保存成功')
            props.onClose()
        } finally {
            setLoading(false)
        }
    }

    const baseColumns = [
        {
            title: '属性名称',
            dataIndex: 'propName',
            render: (_: any, __: any, index: number) => (
                <Input
                    value={baseProps[index]?.propName}
                    onChange={(e) =>
                        handleBasePropChange(index, 'propName', e.target.value)
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
                    value={baseProps[index]?.propCode}
                    onChange={(e) =>
                        handleBasePropChange(index, 'propCode', e.target.value)
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
                    value={baseProps[index]?.propType}
                    options={propTypeOptions}
                    onChange={(value) =>
                        handleBasePropChange(index, 'propType', value)
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
                    value={baseProps[index]?.defaultValue}
                    onChange={(e) =>
                        handleBasePropChange(
                            index,
                            'defaultValue',
                            e.target.value,
                        )
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
                    checked={baseProps[index]?.required}
                    onChange={(checked) =>
                        handleBasePropChange(index, 'required', checked)
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
                    onClick={() => handleRemoveBaseProp(index)}
                >
                    删除
                </Button>
            ),
        },
    ]

    const extendColumns = [
        {
            title: '属性名称',
            dataIndex: 'propName',
            render: (_: any, __: any, index: number) => (
                <Input
                    value={extendProps[index]?.propName}
                    onChange={(e) =>
                        handleExtendPropChange(
                            index,
                            'propName',
                            e.target.value,
                        )
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
                        handleExtendPropChange(
                            index,
                            'propCode',
                            e.target.value,
                        )
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
                        handleExtendPropChange(index, 'propType', value)
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
                        handleExtendPropChange(
                            index,
                            'defaultValue',
                            e.target.value,
                        )
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
                        handleExtendPropChange(index, 'required', checked)
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
                    onClick={() => handleRemoveExtendProp(index)}
                >
                    删除
                </Button>
            ),
        },
    ]

    return (
        <Modal
            title={`${props.record.controlName} - 属性配置`}
            open={props.open}
            onOk={handleSave}
            onCancel={props.onClose}
            okText='保存'
            cancelText='取消'
            width={900}
            confirmLoading={loading}
        >
            <div style={{ marginBottom: 16 }}>
                <Space>
                    <Button
                        type={activeTab === 'base' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('base')}
                    >
                        基础属性
                    </Button>
                    <Button
                        type={activeTab === 'extend' ? 'primary' : 'default'}
                        onClick={() => setActiveTab('extend')}
                    >
                        扩展属性
                    </Button>
                </Space>
            </div>

            {activeTab === 'base' && (
                <>
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={handleAddBaseProp}
                        style={{ marginBottom: 16 }}
                    >
                        新增基础属性
                    </Button>
                    <Table
                        dataSource={baseProps}
                        columns={baseColumns}
                        rowKey={(_, index) => `base-${index}`}
                        pagination={false}
                        size='small'
                    />
                </>
            )}

            {activeTab === 'extend' && (
                <>
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={handleAddExtendProp}
                        style={{ marginBottom: 16 }}
                    >
                        新增扩展属性
                    </Button>
                    <Table
                        dataSource={extendProps}
                        columns={extendColumns}
                        rowKey={(_, index) => `extend-${index}`}
                        pagination={false}
                        size='small'
                    />
                </>
            )}
        </Modal>
    )
}

export default Index

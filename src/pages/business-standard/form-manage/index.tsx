import { useState, useRef, useMemo } from 'react'
import styles from './index.module.scss'

import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { Button, Modal, message, Tag } from 'antd'
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    FieldStringOutlined,
    ApartmentOutlined,
    LinkOutlined,
} from '@ant-design/icons'

import { getForms, deleteForm } from '@/api'
import {
    Forms,
    FormRecord,
    SaveForm,
} from '@/api/business-standard/form-manage/index.interface'

import FormEdit from './form-edit'
import FormFieldManage from './form-field-manage'
import FormProps from './form-props'

const formTypeMap: Record<
    string,
    { text: string; icon: React.ReactNode; color: string }
> = {
    application: {
        text: '应用表单',
        icon: <FieldStringOutlined />,
        color: 'blue',
    },
    process: { text: '流程表单', icon: <ApartmentOutlined />, color: 'purple' },
    integration: { text: '集成表单', icon: <LinkOutlined />, color: 'orange' },
}

const accessLevelMap: Record<string, { text: string; color: string }> = {
    public: { text: '公开', color: 'success' },
    internal: { text: '内部', color: 'processing' },
    confidential: { text: '机密', color: 'warning' },
    secret: { text: '绝密', color: 'error' },
}

const Index = () => {
    const [modalType, setModalType] = useState<'add' | 'edit'>('add')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isFieldOpen, setIsFieldOpen] = useState(false)
    const [isPropsOpen, setIsPropsOpen] = useState(false)
    const actionRef = useRef<ActionType>(null)
    const [loading, setLoading] = useState(false)
    const [initialValues, setInitialValues] = useState<SaveForm>()
    const [selectedRecord, setSelectedRecord] = useState<FormRecord>()

    const columns: ProColumns<FormRecord>[] = useMemo(() => {
        return [
            {
                title: '表单名称',
                dataIndex: 'formName',
                width: 180,
                ellipsis: true,
            },
            {
                title: '表单编码',
                dataIndex: 'formCode',
                width: 160,
                ellipsis: true,
            },
            {
                title: '表单类型',
                dataIndex: 'formType',
                width: 140,
                valueEnum: {
                    application: { text: '应用表单' },
                    process: { text: '流程表单' },
                    integration: { text: '集成表单' },
                },
                render: (_, record) => {
                    const ft = formTypeMap[record.formType]
                    return ft ? (
                        <Tag icon={ft.icon} color={ft.color}>
                            {ft.text}
                        </Tag>
                    ) : (
                        <Tag>{record.formType}</Tag>
                    )
                },
            },
            {
                title: '数据访问定级',
                dataIndex: 'dataAccessLevel',
                width: 120,
                render: (_, record) => {
                    const level = accessLevelMap[record.dataAccessLevel]
                    return level ? (
                        <Tag color={level.color}>{level.text}</Tag>
                    ) : (
                        <Tag>{record.dataAccessLevel}</Tag>
                    )
                },
            },
            {
                title: '字段数',
                dataIndex: 'fields',
                width: 80,
                search: false,
                render: (_, record) => record.fields?.length || 0,
            },
            {
                title: '描述',
                dataIndex: 'description',
                width: 200,
                ellipsis: true,
                search: false,
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                valueEnum: {
                    0: { text: '停用', status: 'Default' },
                    1: { text: '启用', status: 'Success' },
                },
            },
            {
                title: '排序号',
                dataIndex: 'sortNo',
                width: 100,
                search: false,
            },
            {
                title: '操作',
                valueType: 'option',
                width: 260,
                fixed: 'right',
                render: (_, record) => {
                    return (
                        <>
                            <Button
                                type='link'
                                icon={<FieldStringOutlined />}
                                onClick={() => handleFieldManage(record)}
                            >
                                字段
                            </Button>
                            <Button
                                type='link'
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(record)}
                            >
                                编辑
                            </Button>
                            <Button
                                type='link'
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record)}
                            >
                                删除
                            </Button>
                        </>
                    )
                },
            },
        ]
    }, [])

    const handleCreate = () => {
        setModalType('add')
        setInitialValues(undefined)
        setIsModalOpen(true)
    }

    const handleEdit = (record: FormRecord) => {
        setModalType('edit')
        setInitialValues({
            id: record.id,
            formName: record.formName,
            formCode: record.formCode,
            formType: record.formType,
            description: record.description,
            dataAccessLevel: record.dataAccessLevel,
            fields: record.fields,
            extendProps: record.extendProps,
            sortNo: record.sortNo,
            status: record.status,
            version: record.version,
        })
        setIsModalOpen(true)
    }

    const handleDelete = (record: FormRecord) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除表单 "${record.formName}" 吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteForm({ id: record.id })
                    message.success('删除成功')
                    actionRef.current?.reload()
                } catch (error) {
                    message.error('删除失败')
                }
            },
        })
    }

    const handleFieldManage = (record: FormRecord) => {
        setSelectedRecord(record)
        setIsFieldOpen(true)
    }

    const handleModalOk = () => {
        actionRef.current?.reload()
        setIsModalOpen(false)
    }

    const handleModalCancel = () => {
        setIsModalOpen(false)
    }

    const handleFieldClose = () => {
        setIsFieldOpen(false)
        setSelectedRecord(undefined)
        actionRef.current?.reload()
    }

    const handlePropsClose = () => {
        setIsPropsOpen(false)
        setSelectedRecord(undefined)
        actionRef.current?.reload()
    }

    const sendGetForms = async (params: Forms) => {
        try {
            setLoading(true)
            const { data } = await getForms(params)
            return {
                success: true,
                data: data.records,
                total: data.total,
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.pageContainer}>
            <ProTable<FormRecord>
                columns={columns}
                loading={loading}
                actionRef={actionRef}
                rowKey='id'
                request={sendGetForms}
                pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                }}
                scroll={{ x: 1200 }}
                toolBarRender={() => [
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        key='create'
                    >
                        新增表单
                    </Button>,
                ]}
            />

            {isModalOpen && (
                <FormEdit
                    type={modalType}
                    initialValues={initialValues}
                    onSuccess={handleModalOk}
                    onCancel={handleModalCancel}
                />
            )}

            {isFieldOpen && selectedRecord && (
                <FormFieldManage
                    open={isFieldOpen}
                    formRecord={selectedRecord}
                    onClose={handleFieldClose}
                />
            )}

            {isPropsOpen && selectedRecord && (
                <FormProps
                    open={isPropsOpen}
                    record={selectedRecord}
                    onClose={handlePropsClose}
                />
            )}
        </div>
    )
}

export default Index

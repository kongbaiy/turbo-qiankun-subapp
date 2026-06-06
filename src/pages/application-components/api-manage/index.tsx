import { useState, useRef, useMemo } from 'react'
import styles from './index.module.scss'

import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { Button, Modal, message, Tag } from 'antd'
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from '@ant-design/icons'

import { ApiItem } from './type'

import { getApis, deleteApi } from '@/api'
import {
    Apis,
    SaveApi,
} from '@/api/application-components/api-manage/index.interface'

import AddEdit from './add-edit'
import ApiDetail from './api-detail'

const methodColors: Record<string, string> = {
    GET: 'green',
    POST: 'orange',
    PUT: 'blue',
    DELETE: 'red',
    WEBSOCKET: 'purple',
}

const Index = () => {
    const [modalType, setModalType] = useState<'add' | 'edit'>('add')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const actionRef = useRef<ActionType>(null)
    const [loading, setLoading] = useState(false)
    const [initialValues, setInitialValues] = useState<SaveApi>()
    const [selectedApiId, setSelectedApiId] = useState<string>('')

    const columns: ProColumns<ApiItem>[] = useMemo(() => {
        return [
            {
                title: '接口名称',
                dataIndex: 'apiName',
                width: 180,
                ellipsis: true,
            },
            {
                title: '接口路径',
                dataIndex: 'apiPath',
                width: 280,
                ellipsis: true,
            },
            {
                title: '接口类型',
                dataIndex: 'apiType',
                width: 120,
                ellipsis: true,
                valueEnum: {
                    rest: { text: 'RESTful' },
                    websocket: { text: 'WebSocket' },
                    grpc: { text: 'gRPC' },
                    graphql: { text: 'GraphQL' },
                },
            },
            {
                title: '请求方式',
                dataIndex: 'method',
                width: 120,
                ellipsis: true,
                render: (_, record) => (
                    <Tag
                        color={
                            methodColors[record.method?.toUpperCase()] ||
                            'default'
                        }
                    >
                        {record.method?.toUpperCase()}
                    </Tag>
                ),
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
                ellipsis: true,
                valueEnum: {
                    0: { text: '停用', status: 'Default' },
                    1: { text: '启用', status: 'Success' },
                },
            },
            {
                title: '排序号',
                dataIndex: 'sortNo',
                width: 100,
                ellipsis: true,
                search: false,
            },
            {
                title: '版本号',
                dataIndex: 'version',
                width: 100,
                ellipsis: true,
                search: false,
            },
            {
                title: '操作',
                valueType: 'option',
                width: 240,
                fixed: 'right',
                render: (_, record) => {
                    return (
                        <>
                            <Button
                                type='link'
                                icon={<EyeOutlined />}
                                onClick={() => handleViewDetail(record)}
                            >
                                详情
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

    const handleEdit = (record: ApiItem) => {
        setModalType('edit')
        setInitialValues({
            id: record.id,
            apiName: record.apiName,
            apiPath: record.apiPath,
            apiType: record.apiType,
            method: record.method,
            description: record.description,
            sortNo: record.sortNo,
            status: record.status,
            version: record.version,
        })
        setIsModalOpen(true)
    }

    const handleDelete = (record: ApiItem) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除接口 "${record.apiName}" 吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteApi({ id: record.id })
                    message.success('删除成功')
                    actionRef.current?.reload()
                } catch (error) {
                    message.error('删除失败')
                }
            },
        })
    }

    const handleViewDetail = (record: ApiItem) => {
        setSelectedApiId(record.id)
        setIsDetailOpen(true)
    }

    const handleModalOk = () => {
        actionRef.current?.reload()
        setIsModalOpen(false)
    }

    const handleModalCancel = () => {
        setIsModalOpen(false)
    }

    const handleDetailClose = () => {
        setIsDetailOpen(false)
        setSelectedApiId('')
    }

    const sendGetApis = async (params: Apis) => {
        try {
            setLoading(true)
            const { data } = await getApis(params)
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
            <ProTable<ApiItem>
                columns={columns}
                loading={loading}
                actionRef={actionRef}
                rowKey='id'
                request={sendGetApis}
                pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                }}
                scroll={{ x: 1400 }}
                toolBarRender={() => [
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        key='create'
                    >
                        新增接口
                    </Button>,
                ]}
            />

            {isModalOpen && (
                <AddEdit
                    type={modalType}
                    initialValues={initialValues}
                    onSuccess={handleModalOk}
                    onCancel={handleModalCancel}
                />
            )}

            <ApiDetail
                open={isDetailOpen}
                apiId={selectedApiId}
                onClose={handleDetailClose}
            />
        </div>
    )
}

export default Index

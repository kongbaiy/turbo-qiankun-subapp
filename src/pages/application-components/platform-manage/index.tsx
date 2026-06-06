import { useState, useRef } from 'react'
import styles from './index.module.scss'

import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { Button, Modal, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { PlatformItem } from './type'

import { getPlatforms, deletePlatform } from '@/api'
import {
    Platforms,
    SavePlatform,
} from '@/api/application-components/platform-manage/index.interface'

import AddEdit from './add-edit'

const Index = () => {
    const [modalType, setModalType] = useState<'add' | 'edit'>('add')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const actionRef = useRef<ActionType>(null)
    const [loading, setLoading] = useState(false)
    const [initialValues, setInitialValues] = useState<SavePlatform>()

    const columns: ProColumns<PlatformItem>[] = useMemo(() => {
        return [
            {
                title: '平台名称',
                dataIndex: 'platformName',
                width: 180,
                ellipsis: true,
            },
            {
                title: '平台编码',
                dataIndex: 'platformCode',
                width: 160,
                ellipsis: true,
            },
            {
                title: '入口地址',
                dataIndex: 'entryUrl',
                width: 160,
                ellipsis: true,
                search: false,
            },
            {
                title: '登录方式',
                dataIndex: 'loginMethods',
                width: 120,
                ellipsis: true,
                search: false,
            },
            {
                title: '状态',
                dataIndex: 'platformStatus',
                width: 100,
                ellipsis: true,
                valueEnum: {
                    0: { text: '停用', status: 'Default' },
                    1: { text: '启用', status: 'Success' },
                },
            },
            {
                title: '客户端类型',
                dataIndex: 'clientType',
                width: 180,
                ellipsis: true,
                search: false,
            },
            {
                title: '排序号',
                dataIndex: 'sortNo',
                width: 120,
                ellipsis: true,
                search: false,
            },
            {
                title: '版本号',
                dataIndex: 'version',
                ellipsis: true,
                search: false,
            },
            {
                title: '操作',
                valueType: 'option',
                width: 180,
                fixed: 'right',
                render: (_, record) => {
                    return (
                        <>
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
        setIsModalOpen(true)
    }

    const handleEdit = (record: any) => {
        setModalType('edit')
        setInitialValues(record)
        setIsModalOpen(true)
    }

    const handleDelete = (record: PlatformItem) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除平台 "${record.name}" 吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deletePlatform({ id: record.id })
                    message.success('删除成功')
                    actionRef.current?.reload()
                } catch (error) {
                    message.error('删除失败')
                }
            },
        })
    }

    const handleModalOk = () => {
        console.log('yes')
        actionRef.current?.reload()
        setIsModalOpen(false)
    }

    const handleModalCancel = () => {
        setIsModalOpen(false)
    }

    const sendGetPlatforms = async (params: Platforms) => {
        try {
            setLoading(true)
            const { data } = await getPlatforms(params)
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
            <ProTable<PlatformItem>
                columns={columns}
                loading={loading}
                actionRef={actionRef}
                rowKey='id'
                request={sendGetPlatforms}
                pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                }}
                scroll={{ x: 1300 }}
                toolBarRender={() => [
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        key='create'
                    >
                        新增平台
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
        </div>
    )
}

export default Index

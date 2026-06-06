import { useState, useRef, useMemo } from 'react'
import styles from './index.module.scss'

import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { Button, Modal, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { ComponentItem } from './type'

import { getComponents, deleteComponent } from '@/api'
import {
    Components,
    SaveComponent,
} from '@/api/application-components/component-manage/index.interface'

import AddEdit from './add-edit'

const Index = () => {
    const [modalType, setModalType] = useState<'add' | 'edit'>('add')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const actionRef = useRef<ActionType>(null)
    const [loading, setLoading] = useState(false)
    const [initialValues, setInitialValues] = useState<SaveComponent>()

    const columns: ProColumns<ComponentItem>[] = useMemo(() => {
        return [
            {
                title: '组件名称',
                dataIndex: 'componentName',
                width: 180,
                ellipsis: true,
            },
            {
                title: '组件编码',
                dataIndex: 'componentCode',
                width: 160,
                ellipsis: true,
            },
            {
                title: '组件类型',
                dataIndex: 'componentType',
                width: 140,
                ellipsis: true,
                valueEnum: {
                    ui: { text: 'UI组件' },
                    business: { text: '业务组件' },
                    layout: { text: '布局组件' },
                    form: { text: '表单组件' },
                    chart: { text: '图表组件' },
                },
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
        setInitialValues(undefined)
        setIsModalOpen(true)
    }

    const handleEdit = (record: ComponentItem) => {
        setModalType('edit')
        setInitialValues({
            id: record.id,
            componentName: record.componentName,
            componentCode: record.componentCode,
            componentType: record.componentType,
            description: record.description,
            sortNo: record.sortNo,
            status: record.status,
            version: record.version,
        })
        setIsModalOpen(true)
    }

    const handleDelete = (record: ComponentItem) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除组件 "${record.componentName}" 吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteComponent({ id: record.id })
                    message.success('删除成功')
                    actionRef.current?.reload()
                } catch (error) {
                    message.error('删除失败')
                }
            },
        })
    }

    const handleModalOk = () => {
        actionRef.current?.reload()
        setIsModalOpen(false)
    }

    const handleModalCancel = () => {
        setIsModalOpen(false)
    }

    const sendGetComponents = async (params: Components) => {
        try {
            setLoading(true)
            const { data } = await getComponents(params)
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
            <ProTable<ComponentItem>
                columns={columns}
                loading={loading}
                actionRef={actionRef}
                rowKey='id'
                request={sendGetComponents}
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
                        新增组件
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

import { useState, useRef, useMemo } from 'react'
import styles from './index.module.scss'

import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { Button, Modal, message, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { DimensionTypeItem } from './type'

import { getDimensionTypes, deleteDimensionType } from '@/api'
import {
    DimensionTypes,
    SaveDimensionType,
} from '@/api/global-data-standard/dimension-manage/index.interface'

import TypeEdit from './type-edit'

interface Props {
    onSelectType: (type: DimensionTypeItem) => void
    selectedTypeId?: string
}

const Index = (props: Props) => {
    const [modalType, setModalType] = useState<'add' | 'edit'>('add')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const actionRef = useRef<ActionType>(null)
    const [loading, setLoading] = useState(false)
    const [initialValues, setInitialValues] = useState<SaveDimensionType>()

    const columns: ProColumns<DimensionTypeItem>[] = useMemo(() => {
        return [
            {
                title: '维度类型编码',
                dataIndex: 'typeCode',
                width: 160,
                ellipsis: true,
            },
            {
                title: '维度类型名称',
                dataIndex: 'typeName',
                width: 180,
                ellipsis: true,
            },
            {
                title: '描述',
                dataIndex: 'description',
                width: 200,
                ellipsis: true,
                search: false,
            },
            {
                title: '系统维度',
                dataIndex: 'isSystem',
                width: 100,
                ellipsis: true,
                search: false,
                render: (value) => (
                    <Tag color={value === 1 ? 'blue' : 'default'}>
                        {value === 1 ? '是' : '否'}
                    </Tag>
                ),
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
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleEdit(record)
                                }}
                            >
                                编辑
                            </Button>
                            <Button
                                type='link'
                                danger
                                icon={<DeleteOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(record)
                                }}
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

    const handleEdit = (record: DimensionTypeItem) => {
        setModalType('edit')
        setInitialValues({
            id: record.id,
            typeCode: record.typeCode,
            typeName: record.typeName,
            description: record.description,
            isSystem: record.isSystem,
            sortNo: record.sortNo,
            status: record.status,
        })
        setIsModalOpen(true)
    }

    const handleDelete = (record: DimensionTypeItem) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除维度类型 "${record.typeName}" 吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteDimensionType({ id: record.id })
                    message.success('删除成功')
                    actionRef.current?.reload()
                } catch (error) {
                    message.error('删除失败')
                }
            },
        })
    }

    const handleRowClick = (record: DimensionTypeItem) => {
        props.onSelectType(record)
    }

    const handleModalOk = () => {
        actionRef.current?.reload()
        setIsModalOpen(false)
    }

    const handleModalCancel = () => {
        setIsModalOpen(false)
    }

    const sendGetTypes = async (params: DimensionTypes) => {
        try {
            setLoading(true)
            const { data } = await getDimensionTypes(params)
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
            <ProTable<DimensionTypeItem>
                columns={columns}
                loading={loading}
                actionRef={actionRef}
                rowKey='id'
                request={sendGetTypes}
                pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                }}
                scroll={{ x: 1000 }}
                toolBarRender={() => [
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        key='create'
                    >
                        新增维度类型
                    </Button>,
                ]}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: {
                        cursor: 'pointer',
                        background:
                            record.id === props.selectedTypeId
                                ? '#e6f7ff'
                                : undefined,
                    },
                })}
            />

            {isModalOpen && (
                <TypeEdit
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

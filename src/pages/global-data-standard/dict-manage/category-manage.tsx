import { useState, useRef, useMemo } from 'react'
import styles from './index.module.scss'

import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { Button, Modal, message, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { DictCategoryItem } from './type'

import { getDictCategories, deleteDictCategory } from '@/api'
import {
    DictCategories,
    SaveDictCategory,
} from '@/api/global-data-standard/dict-manage/index.interface'

import CategoryEdit from './category-edit'

interface Props {
    onSelectCategory: (category: DictCategoryItem) => void
    selectedCategoryId?: string
}

const Index = (props: Props) => {
    const [modalType, setModalType] = useState<'add' | 'edit'>('add')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const actionRef = useRef<ActionType>(null)
    const [loading, setLoading] = useState(false)
    const [initialValues, setInitialValues] = useState<SaveDictCategory>()

    const columns: ProColumns<DictCategoryItem>[] = useMemo(() => {
        return [
            {
                title: '分类编码',
                dataIndex: 'categoryCode',
                width: 160,
                ellipsis: true,
            },
            {
                title: '分类名称',
                dataIndex: 'categoryName',
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
                title: '允许扩展',
                dataIndex: 'allowExtend',
                width: 100,
                ellipsis: true,
                search: false,
                render: (value) => (
                    <Tag color={value === 1 ? 'success' : 'default'}>
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

    const handleEdit = (record: DictCategoryItem) => {
        setModalType('edit')
        setInitialValues({
            id: record.id,
            categoryCode: record.categoryCode,
            categoryName: record.categoryName,
            description: record.description,
            allowExtend: record.allowExtend,
            sortNo: record.sortNo,
            status: record.status,
        })
        setIsModalOpen(true)
    }

    const handleDelete = (record: DictCategoryItem) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除字典分类 "${record.categoryName}" 吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteDictCategory({ id: record.id })
                    message.success('删除成功')
                    actionRef.current?.reload()
                } catch (error) {
                    message.error('删除失败')
                }
            },
        })
    }

    const handleRowClick = (record: DictCategoryItem) => {
        props.onSelectCategory(record)
    }

    const handleModalOk = () => {
        actionRef.current?.reload()
        setIsModalOpen(false)
    }

    const handleModalCancel = () => {
        setIsModalOpen(false)
    }

    const sendGetCategories = async (params: DictCategories) => {
        try {
            setLoading(true)
            const { data } = await getDictCategories(params)
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
            <ProTable<DictCategoryItem>
                columns={columns}
                loading={loading}
                actionRef={actionRef}
                rowKey='id'
                request={sendGetCategories}
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
                        新增分类
                    </Button>,
                ]}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: {
                        cursor: 'pointer',
                        background:
                            record.id === props.selectedCategoryId
                                ? '#e6f7ff'
                                : undefined,
                    },
                })}
            />

            {isModalOpen && (
                <CategoryEdit
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

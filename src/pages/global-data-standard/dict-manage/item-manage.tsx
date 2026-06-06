import { useState, useRef, useMemo } from 'react'
import styles from './index.module.scss'

import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { Button, Modal, message } from 'antd'
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ImportOutlined,
    ExportOutlined,
} from '@ant-design/icons'

import { DictItemType, DictCategoryItem } from './type'

import { getDictItems, deleteDictItem, exportDict } from '@/api'
import {
    DictItems,
    SaveDictItem,
} from '@/api/global-data-standard/dict-manage/index.interface'

import ItemEdit from './item-edit'
import ImportModal from './import-modal'

interface Props {
    category?: DictCategoryItem
}

const Index = (props: Props) => {
    const [modalType, setModalType] = useState<'add' | 'edit'>('add')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isImportOpen, setIsImportOpen] = useState(false)
    const actionRef = useRef<ActionType>(null)
    const [loading, setLoading] = useState(false)
    const [initialValues, setInitialValues] = useState<SaveDictItem>()
    const [parentOptions, setParentOptions] = useState<any[]>([])

    const columns: ProColumns<DictItemType>[] = useMemo(() => {
        return [
            {
                title: '字典编码',
                dataIndex: 'itemCode',
                width: 160,
                ellipsis: true,
            },
            {
                title: '字典名称',
                dataIndex: 'itemName',
                width: 180,
                ellipsis: true,
            },
            {
                title: '字典值',
                dataIndex: 'itemValue',
                width: 160,
                ellipsis: true,
                search: false,
            },
            {
                title: '上级字典',
                dataIndex: 'parentName',
                width: 160,
                ellipsis: true,
                search: false,
                // render: (value: string) =>
                //     value || <Tag color='default'>顶级</Tag>,
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
        if (!props.category) {
            message.warning('请先选择字典分类')
            return
        }
        setModalType('add')
        setInitialValues(undefined)
        setIsModalOpen(true)
    }

    const handleEdit = (record: DictItemType) => {
        setModalType('edit')
        setInitialValues({
            id: record.id,
            categoryId: record.categoryId,
            itemCode: record.itemCode,
            itemName: record.itemName,
            parentId: record.parentId,
            itemValue: record.itemValue,
            description: record.description,
            sortNo: record.sortNo,
            status: record.status,
        })
        setIsModalOpen(true)
    }

    const handleDelete = (record: DictItemType) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除字典项 "${record.itemName}" 吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteDictItem({ id: record.id })
                    message.success('删除成功')
                    actionRef.current?.reload()
                } catch (error) {
                    message.error('删除失败')
                }
            },
        })
    }

    const handleExport = async () => {
        if (!props.category) {
            message.warning('请先选择字典分类')
            return
        }
        try {
            const response = await exportDict({ categoryId: props.category.id })
            const blob = new Blob([response.data])
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `字典_${props.category.categoryCode}_${Date.now()}.xlsx`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            message.success('导出成功')
        } catch (error) {
            message.error('导出失败')
        }
    }

    const handleImport = () => {
        if (!props.category) {
            message.warning('请先选择字典分类')
            return
        }
        setIsImportOpen(true)
    }

    const handleModalOk = () => {
        actionRef.current?.reload()
        setIsModalOpen(false)
    }

    const handleModalCancel = () => {
        setIsModalOpen(false)
    }

    const handleImportSuccess = () => {
        actionRef.current?.reload()
        setIsImportOpen(false)
    }

    const handleImportCancel = () => {
        setIsImportOpen(false)
    }

    const sendGetItems = async (params: DictItems) => {
        if (!props.category) {
            return {
                success: true,
                data: [],
                total: 0,
            }
        }
        try {
            setLoading(true)
            const { data } = await getDictItems({
                ...params,
                categoryId: props.category.id,
            })
            const records = data.records || []
            const options = records.map((item: DictItemType) => ({
                title: item.itemName,
                value: item.id,
                key: item.id,
            }))
            setParentOptions(options)
            return {
                success: true,
                data: records,
                total: data.total,
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.pageContainer}>
            <ProTable<DictItemType>
                columns={columns}
                loading={loading}
                actionRef={actionRef}
                rowKey='id'
                request={sendGetItems}
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
                        新增字典项
                    </Button>,
                    <Button
                        icon={<ImportOutlined />}
                        onClick={handleImport}
                        key='import'
                    >
                        导入
                    </Button>,
                    <Button
                        icon={<ExportOutlined />}
                        onClick={handleExport}
                        key='export'
                    >
                        导出
                    </Button>,
                ]}
            />

            {isModalOpen && props.category && (
                <ItemEdit
                    type={modalType}
                    categoryId={props.category.id}
                    parentOptions={parentOptions}
                    initialValues={initialValues}
                    onSuccess={handleModalOk}
                    onCancel={handleModalCancel}
                />
            )}

            {isImportOpen && props.category && (
                <ImportModal
                    categoryId={props.category.id}
                    onSuccess={handleImportSuccess}
                    onCancel={handleImportCancel}
                />
            )}
        </div>
    )
}

export default Index

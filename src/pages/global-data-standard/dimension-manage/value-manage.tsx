import { useState, useRef, useMemo } from 'react'
import styles from './index.module.scss'

import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { Button, Modal, message, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { DimensionValueItem, DimensionTypeItem } from './type'

import { getDimensionValues, deleteDimensionValue } from '@/api'
import {
    DimensionValues,
    SaveDimensionValue,
} from '@/api/global-data-standard/dimension-manage/index.interface'

import ValueEdit from './value-edit'

interface Props {
    type?: DimensionTypeItem
}

const Index = (props: Props) => {
    const [modalType, setModalType] = useState<'add' | 'edit'>('add')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const actionRef = useRef<ActionType>(null)
    const [loading, setLoading] = useState(false)
    const [initialValues, setInitialValues] = useState<SaveDimensionValue>()
    const [parentOptions, setParentOptions] = useState<any[]>([])

    const isSystemType = props.type?.isSystem === 1

    const columns: ProColumns<DimensionValueItem>[] = useMemo(() => {
        return [
            {
                title: '维度值编码',
                dataIndex: 'valueCode',
                width: 160,
                ellipsis: true,
            },
            {
                title: '维度值名称',
                dataIndex: 'valueName',
                width: 180,
                ellipsis: true,
            },
            {
                title: '上级维度',
                dataIndex: 'parentName',
                width: 160,
                ellipsis: true,
                search: false,
                render: (value) => value || <Tag color='default'>顶级</Tag>,
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
                    if (isSystemType) {
                        return <Tag color='blue'>系统维度，不可修改</Tag>
                    }
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
    }, [isSystemType])

    const handleCreate = () => {
        if (!props.type) {
            message.warning('请先选择维度类型')
            return
        }
        if (isSystemType) {
            message.warning('系统维度不允许修改')
            return
        }
        setModalType('add')
        setInitialValues(undefined)
        setIsModalOpen(true)
    }

    const handleEdit = (record: DimensionValueItem) => {
        if (isSystemType) {
            message.warning('系统维度不允许修改')
            return
        }
        setModalType('edit')
        setInitialValues({
            id: record.id,
            typeId: record.typeId,
            valueCode: record.valueCode,
            valueName: record.valueName,
            parentId: record.parentId,
            description: record.description,
            sortNo: record.sortNo,
            status: record.status,
        })
        setIsModalOpen(true)
    }

    const handleDelete = (record: DimensionValueItem) => {
        if (isSystemType) {
            message.warning('系统维度不允许修改')
            return
        }
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除维度值 "${record.valueName}" 吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteDimensionValue({ id: record.id })
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

    const sendGetValues = async (params: DimensionValues) => {
        if (!props.type) {
            return {
                success: true,
                data: [],
                total: 0,
            }
        }
        try {
            setLoading(true)
            const { data } = await getDimensionValues({
                ...params,
                typeId: props.type.id,
            })
            const records = data.records || []
            const options = records.map((item: DimensionValueItem) => ({
                title: item.valueName,
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
            <ProTable<DimensionValueItem>
                columns={columns}
                loading={loading}
                actionRef={actionRef}
                rowKey='id'
                request={sendGetValues}
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
                        disabled={isSystemType}
                    >
                        新增维度值
                    </Button>,
                ]}
            />

            {isModalOpen && props.type && (
                <ValueEdit
                    type={modalType}
                    typeId={props.type.id}
                    parentOptions={parentOptions}
                    initialValues={initialValues}
                    onSuccess={handleModalOk}
                    onCancel={handleModalCancel}
                />
            )}
        </div>
    )
}

export default Index

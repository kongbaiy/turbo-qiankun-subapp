import { useState, useRef, useMemo } from 'react'
import styles from './index.module.scss'

import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { Button, Modal, message } from 'antd'
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from '@ant-design/icons'

import { getSerials, deleteSerial } from '@/api'
import {
    Serials,
    Serial,
    SaveSerial,
} from '@/api/global-data-standard/serial-manage/index.interface'

import SerialEdit from './serial-edit'
import SerialPreview from './serial-preview'

const resetTypeMap: Record<string, string> = {
    none: '不重置',
    day: '按日重置',
    month: '按月重置',
    year: '按年重置',
}

const Index = () => {
    const [modalType, setModalType] = useState<'add' | 'edit'>('add')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const actionRef = useRef<ActionType>(null)
    const [loading, setLoading] = useState(false)
    const [initialValues, setInitialValues] = useState<SaveSerial>()
    const [selectedSerial, setSelectedSerial] = useState<Serial>()

    const columns: ProColumns<Serial>[] = useMemo(() => {
        return [
            {
                title: '流水号编码',
                dataIndex: 'serialCode',
                width: 160,
                ellipsis: true,
            },
            {
                title: '流水号名称',
                dataIndex: 'serialName',
                width: 180,
                ellipsis: true,
            },
            {
                title: '前缀',
                dataIndex: 'prefix',
                width: 120,
                ellipsis: true,
                search: false,
            },
            {
                title: '日期格式',
                dataIndex: 'dateFormat',
                width: 140,
                ellipsis: true,
                search: false,
            },
            {
                title: '位数',
                dataIndex: 'digitLength',
                width: 80,
                ellipsis: true,
                search: false,
            },
            {
                title: '起始值',
                dataIndex: 'startValue',
                width: 100,
                ellipsis: true,
                search: false,
            },
            {
                title: '步长',
                dataIndex: 'step',
                width: 80,
                ellipsis: true,
                search: false,
            },
            {
                title: '后缀',
                dataIndex: 'suffix',
                width: 100,
                ellipsis: true,
                search: false,
            },
            {
                title: '重置规则',
                dataIndex: 'resetType',
                width: 120,
                ellipsis: true,
                search: false,
                render: (value: any) => resetTypeMap[value] || value,
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
                width: 240,
                fixed: 'right',
                render: (_, record) => {
                    return (
                        <>
                            <Button
                                type='link'
                                icon={<EyeOutlined />}
                                onClick={() => handlePreview(record)}
                            >
                                预览
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

    const handleEdit = (record: Serial) => {
        setModalType('edit')
        setInitialValues({
            id: record.id,
            serialCode: record.serialCode,
            serialName: record.serialName,
            prefix: record.prefix,
            dateFormat: record.dateFormat,
            digitLength: record.digitLength,
            startValue: record.startValue,
            step: record.step,
            suffix: record.suffix,
            resetType: record.resetType,
            description: record.description,
            sortNo: record.sortNo,
            status: record.status,
        })
        setIsModalOpen(true)
    }

    const handleDelete = (record: Serial) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除流水号规则 "${record.serialName}" 吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteSerial({ id: record.id })
                    message.success('删除成功')
                    actionRef.current?.reload()
                } catch (error) {
                    message.error('删除失败')
                }
            },
        })
    }

    const handlePreview = (record: Serial) => {
        setSelectedSerial(record)
        setIsPreviewOpen(true)
    }

    const handleModalOk = () => {
        actionRef.current?.reload()
        setIsModalOpen(false)
    }

    const handleModalCancel = () => {
        setIsModalOpen(false)
    }

    const handlePreviewClose = () => {
        setIsPreviewOpen(false)
        setSelectedSerial(undefined)
    }

    const sendGetSerials = async (params: Serials) => {
        try {
            setLoading(true)
            const { data } = await getSerials(params)
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
            <ProTable<Serial>
                columns={columns}
                loading={loading}
                actionRef={actionRef}
                rowKey='id'
                request={sendGetSerials}
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
                        新增流水号
                    </Button>,
                ]}
            />

            {isModalOpen && (
                <SerialEdit
                    type={modalType}
                    initialValues={initialValues}
                    onSuccess={handleModalOk}
                    onCancel={handleModalCancel}
                />
            )}

            <SerialPreview
                open={isPreviewOpen}
                serial={selectedSerial}
                onClose={handlePreviewClose}
            />
        </div>
    )
}

export default Index

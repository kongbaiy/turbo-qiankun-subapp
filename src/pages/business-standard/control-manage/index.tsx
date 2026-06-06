import { useState, useRef, useMemo } from 'react'
import styles from './index.module.scss'

import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components'
import { Button, Modal, message, Tag } from 'antd'
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SettingOutlined,
} from '@ant-design/icons'

import { getControls, deleteControl } from '@/api'
import {
    Controls,
    ControlRecord,
    SaveControl,
} from '@/api/business-standard/control-manage/index.interface'

import ControlEdit from './control-edit'
import ControlProps from './control-props'

const controlCategoryMap: Record<string, { text: string; color: string }> = {
    text: { text: '文本', color: 'blue' },
    number: { text: '数值', color: 'cyan' },
    select: { text: '选择', color: 'green' },
    datetime: { text: '日期时间', color: 'purple' },
    file: { text: '文件媒体', color: 'orange' },
    other: { text: '其他交互', color: 'default' },
    relation: { text: '关联选择', color: 'geekblue' },
    display: { text: '数据展示', color: 'lime' },
    map: { text: '地图定位', color: 'gold' },
    compute: { text: '计算衍生', color: 'magenta' },
    thirdparty: { text: '第三方集成', color: 'volcano' },
    org: { text: '组织架构', color: 'processing' },
    budget: { text: '预算管理', color: 'warning' },
    finance: { text: '财务核算', color: 'success' },
    supply: { text: '供应链', color: 'error' },
}

const Index = () => {
    const [modalType, setModalType] = useState<'add' | 'edit'>('add')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPropsOpen, setIsPropsOpen] = useState(false)
    const actionRef = useRef<ActionType>(null)
    const [loading, setLoading] = useState(false)
    const [initialValues, setInitialValues] = useState<SaveControl>()
    const [selectedRecord, setSelectedRecord] = useState<ControlRecord>()

    const columns: ProColumns<ControlRecord>[] = useMemo(() => {
        return [
            {
                title: '控件名称',
                dataIndex: 'controlName',
                width: 180,
                ellipsis: true,
            },
            {
                title: '控件编码',
                dataIndex: 'controlCode',
                width: 160,
                ellipsis: true,
            },
            {
                title: '控件类型',
                dataIndex: 'controlType',
                width: 120,
                valueEnum: {
                    basic: { text: '基础控件' },
                    advanced: { text: '高级控件' },
                    business: { text: '业务控件' },
                },
            },
            {
                title: '控件分类',
                dataIndex: 'controlCategory',
                width: 120,
                render: (_, record) => {
                    const cat = controlCategoryMap[record.controlCategory]
                    return cat ? (
                        <Tag color={cat.color}>{cat.text}</Tag>
                    ) : (
                        <Tag>{record.controlCategory}</Tag>
                    )
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
                width: 220,
                fixed: 'right',
                render: (_, record) => {
                    return (
                        <>
                            <Button
                                type='link'
                                icon={<SettingOutlined />}
                                onClick={() => handleProps(record)}
                            >
                                属性
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

    const handleEdit = (record: ControlRecord) => {
        setModalType('edit')
        setInitialValues({
            id: record.id,
            controlName: record.controlName,
            controlCode: record.controlCode,
            controlType: record.controlType,
            controlCategory: record.controlCategory,
            description: record.description,
            icon: record.icon,
            baseProps: record.baseProps,
            extendProps: record.extendProps,
            sortNo: record.sortNo,
            status: record.status,
            version: record.version,
        })
        setIsModalOpen(true)
    }

    const handleDelete = (record: ControlRecord) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除控件 "${record.controlName}" 吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteControl({ id: record.id })
                    message.success('删除成功')
                    actionRef.current?.reload()
                } catch (error) {
                    message.error('删除失败')
                }
            },
        })
    }

    const handleProps = (record: ControlRecord) => {
        setSelectedRecord(record)
        setIsPropsOpen(true)
    }

    const handleModalOk = () => {
        actionRef.current?.reload()
        setIsModalOpen(false)
    }

    const handleModalCancel = () => {
        setIsModalOpen(false)
    }

    const handlePropsClose = () => {
        setIsPropsOpen(false)
        setSelectedRecord(undefined)
    }

    const sendGetControls = async (params: Controls) => {
        try {
            setLoading(true)
            const { data } = await getControls(params)
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
            <ProTable<ControlRecord>
                columns={columns}
                loading={loading}
                actionRef={actionRef}
                rowKey='id'
                request={sendGetControls}
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
                        新增控件
                    </Button>,
                ]}
            />

            {isModalOpen && (
                <ControlEdit
                    type={modalType}
                    initialValues={initialValues}
                    onSuccess={handleModalOk}
                    onCancel={handleModalCancel}
                />
            )}

            {isPropsOpen && selectedRecord && (
                <ControlProps
                    open={isPropsOpen}
                    record={selectedRecord}
                    onClose={handlePropsClose}
                />
            )}
        </div>
    )
}

export default Index

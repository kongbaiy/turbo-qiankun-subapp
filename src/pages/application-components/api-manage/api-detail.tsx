import { useState, useEffect } from 'react'
import { Drawer, Tabs, Descriptions, Table, Tag, Spin, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import {
    getApiDetail,
    getApiLogs,
} from '@/api/application-components/api-manage'
import type {
    ApiDetail as ApiDetailType,
    ApiLog,
} from '@/api/application-components/api-manage/index.interface'

interface Props {
    open: boolean
    apiId: string
    onClose: () => void
}

const methodColors: Record<string, string> = {
    GET: 'green',
    POST: 'orange',
    PUT: 'blue',
    DELETE: 'red',
    WEBSOCKET: 'purple',
}

const statusColors: Record<number, string> = {
    0: 'default',
    1: 'success',
}

const Index = (props: Props) => {
    const [loading, setLoading] = useState(false)
    const [detail, setDetail] = useState<ApiDetailType>()
    const [logs, setLogs] = useState<ApiLog[]>([])
    const [logsLoading, setLogsLoading] = useState(false)

    useEffect(() => {
        if (props.open && props.apiId) {
            fetchDetail()
            fetchLogs()
        }
    }, [props.open, props.apiId])

    const fetchDetail = async () => {
        try {
            setLoading(true)
            const { data } = await getApiDetail({ keyword: props.apiId })
            setDetail(data)
        } finally {
            setLoading(false)
        }
    }

    const fetchLogs = async () => {
        try {
            setLogsLoading(true)
            const { data } = await getApiLogs({ apiId: props.apiId })
            setLogs(data.records || [])
        } finally {
            setLogsLoading(false)
        }
    }

    const logColumns: ColumnsType<ApiLog> = [
        {
            title: '请求时间',
            dataIndex: 'requestTime',
            width: 180,
        },
        {
            title: '响应时间',
            dataIndex: 'responseTime',
            width: 180,
        },
        {
            title: '耗时(ms)',
            dataIndex: 'duration',
            width: 100,
            render: (duration: number) => (
                <Tag
                    color={
                        duration > 1000
                            ? 'red'
                            : duration > 500
                              ? 'orange'
                              : 'green'
                    }
                >
                    {duration}ms
                </Tag>
            ),
        },
        {
            title: '状态码',
            dataIndex: 'statusCode',
            width: 100,
            render: (code: number) => (
                <Tag color={code >= 200 && code < 300 ? 'success' : 'error'}>
                    {code}
                </Tag>
            ),
        },
        {
            title: '请求参数',
            dataIndex: 'requestParams',
            width: 200,
            ellipsis: true,
        },
        {
            title: '响应数据',
            dataIndex: 'responseData',
            width: 200,
            ellipsis: true,
        },
        {
            title: '错误信息',
            dataIndex: 'errorMessage',
            width: 200,
            ellipsis: true,
            render: (msg?: string) =>
                msg ? <span style={{ color: '#ff4d4f' }}>{msg}</span> : '-',
        },
        {
            title: '客户端IP',
            dataIndex: 'clientIp',
            width: 140,
        },
    ]

    const renderJsonPreview = (jsonStr?: string) => {
        if (!jsonStr) return <Empty description='暂无数据' />
        try {
            const parsed = JSON.parse(jsonStr)
            return (
                <pre
                    style={{
                        background: '#f6f8fa',
                        padding: 16,
                        borderRadius: 8,
                        overflow: 'auto',
                        maxHeight: 400,
                        fontSize: 12,
                        lineHeight: 1.6,
                    }}
                >
                    {JSON.stringify(parsed, null, 2)}
                </pre>
            )
        } catch {
            return <pre style={{ padding: 16 }}>{jsonStr}</pre>
        }
    }

    const items = [
        {
            key: 'basic',
            label: '基本信息',
            children: (
                <Spin spinning={loading}>
                    {detail && (
                        <Descriptions column={2} bordered>
                            <Descriptions.Item label='接口名称' span={2}>
                                {detail.apiName}
                            </Descriptions.Item>
                            <Descriptions.Item label='接口路径' span={2}>
                                {detail.apiPath}
                            </Descriptions.Item>
                            <Descriptions.Item label='接口类型'>
                                {detail.apiType}
                            </Descriptions.Item>
                            <Descriptions.Item label='请求方式'>
                                <Tag
                                    color={
                                        methodColors[
                                            detail.method?.toUpperCase()
                                        ] || 'default'
                                    }
                                >
                                    {detail.method?.toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label='状态'>
                                <Tag
                                    color={
                                        statusColors[detail.status] || 'default'
                                    }
                                >
                                    {detail.status === 1 ? '启用' : '停用'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label='排序号'>
                                {detail.sortNo}
                            </Descriptions.Item>
                            <Descriptions.Item label='版本号'>
                                {detail.version}
                            </Descriptions.Item>
                            <Descriptions.Item label='创建时间'>
                                {detail.createdAt}
                            </Descriptions.Item>
                            <Descriptions.Item label='更新时间'>
                                {detail.updatedAt}
                            </Descriptions.Item>
                            <Descriptions.Item label='接口描述' span={2}>
                                {detail.description || '-'}
                            </Descriptions.Item>
                        </Descriptions>
                    )}
                </Spin>
            ),
        },
        {
            key: 'request',
            label: '请求参数',
            children: (
                <Spin spinning={loading}>
                    {renderJsonPreview(detail?.requestSchema)}
                </Spin>
            ),
        },
        {
            key: 'response',
            label: '响应参数',
            children: (
                <Spin spinning={loading}>
                    {renderJsonPreview(detail?.responseSchema)}
                </Spin>
            ),
        },
        {
            key: 'logs',
            label: '调用日志',
            children: (
                <Spin spinning={logsLoading}>
                    <Table
                        columns={logColumns}
                        dataSource={logs}
                        rowKey='id'
                        pagination={{
                            showQuickJumper: true,
                            showSizeChanger: true,
                        }}
                        scroll={{ x: 1200 }}
                        size='small'
                    />
                </Spin>
            ),
        },
    ]

    return (
        <Drawer
            title='接口详情'
            width={900}
            open={props.open}
            onClose={props.onClose}
            destroyOnClose
        >
            <Tabs items={items} defaultActiveKey='basic' />
        </Drawer>
    )
}

export default Index

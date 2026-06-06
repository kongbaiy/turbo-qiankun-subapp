import { useState } from 'react'
import { Modal, Upload, message, Alert } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'

import { importDict } from '@/api/global-data-standard/dict-manage'

interface Props {
    categoryId: string
    onSuccess: () => void
    onCancel: () => void
}

const { Dragger } = Upload

const Index = (props: Props) => {
    const [loading, setLoading] = useState(false)
    const [fileList, setFileList] = useState<any[]>([])

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        accept: '.xlsx,.xls,.csv',
        fileList,
        beforeUpload: (file) => {
            const isExcel =
                file.type ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel' ||
                file.name.endsWith('.csv')
            if (!isExcel) {
                message.error('只支持上传 Excel 或 CSV 文件')
                return Upload.LIST_IGNORE
            }
            setFileList([file])
            return false
        },
        onRemove: () => {
            setFileList([])
        },
    }

    const handleOk = async () => {
        if (fileList.length === 0) {
            message.warning('请选择要导入的文件')
            return
        }
        try {
            setLoading(true)
            await importDict({
                categoryId: props.categoryId,
                file: fileList[0],
            })
            message.success('导入成功')
            props.onSuccess()
        } catch (error) {
            message.error('导入失败')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setFileList([])
        props.onCancel()
    }

    return (
        <Modal
            title='导入字典'
            open={true}
            onOk={handleOk}
            onCancel={handleCancel}
            okText='导入'
            cancelText='取消'
            width={600}
            loading={loading}
        >
            <Alert
                message='导入说明'
                description={
                    <div>
                        <p>1. 支持 Excel (.xlsx, .xls) 或 CSV (.csv) 格式</p>
                        <p>
                            2.
                            文件需包含以下列：字典编码、字典名称、字典值、上级编码、描述、排序号、状态
                        </p>
                        <p>3. 状态列请填写：1-启用，0-停用</p>
                        <p>4. 上级编码为空表示顶级字典项</p>
                    </div>
                }
                type='info'
                showIcon
                style={{ marginBottom: 16 }}
            />
            <Dragger {...uploadProps}>
                <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                </p>
                <p className='ant-upload-text'>点击或拖拽文件到此区域上传</p>
                <p className='ant-upload-hint'>
                    支持单个文件上传，文件大小不超过 10MB
                </p>
            </Dragger>
        </Modal>
    )
}

export default Index

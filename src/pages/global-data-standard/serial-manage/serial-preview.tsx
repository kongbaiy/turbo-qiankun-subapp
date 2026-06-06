import { useState, useEffect } from 'react'
import { Modal, Spin, Empty, Alert } from 'antd'
import styles from './index.module.scss'

import { previewSerial } from '@/api/global-data-standard/serial-manage'
import type { Serial } from '@/api/global-data-standard/serial-manage/index.interface'

interface Props {
    open: boolean
    serial?: Serial
    onClose: () => void
}

const Index = (props: Props) => {
    const [loading, setLoading] = useState(false)
    const [previews, setPreviews] = useState<string[]>([])

    useEffect(() => {
        if (props.open && props.serial) {
            fetchPreview()
        }
    }, [props.open, props.serial])

    const fetchPreview = async () => {
        if (!props.serial) return
        try {
            setLoading(true)
            const { data } = await previewSerial({
                id: props.serial.id,
                count: 5,
            })
            setPreviews(data.preview || [])
        } catch (error) {
            setPreviews([])
        } finally {
            setLoading(false)
        }
    }

    const generateExample = () => {
        if (!props.serial) return ''
        const { prefix, dateFormat, digitLength, startValue, suffix } =
            props.serial
        const dateStr = dateFormat
            ? new Date().toISOString().slice(0, 10).replace(/-/g, '')
            : ''
        const digitStr = String(startValue).padStart(digitLength, '0')
        return `${prefix || ''}${dateStr}${digitStr}${suffix || ''}`
    }

    return (
        <Modal
            title='流水号预览'
            open={props.open}
            onCancel={props.onClose}
            footer={null}
            width={600}
        >
            <Spin spinning={loading}>
                {props.serial && (
                    <div style={{ marginBottom: 16 }}>
                        <Alert
                            message={
                                <div>
                                    <p>
                                        <strong>规则说明：</strong>
                                    </p>
                                    <p>编码：{props.serial.serialCode}</p>
                                    <p>名称：{props.serial.serialName}</p>
                                    <p>
                                        格式：{props.serial.prefix || ''}
                                        {props.serial.dateFormat || ''}
                                        {'{'.padEnd(
                                            props.serial.digitLength,
                                            '0',
                                        ) + '}'}
                                        {props.serial.suffix || ''}
                                    </p>
                                    <p>示例：{generateExample()}</p>
                                </div>
                            }
                            type='info'
                        />
                    </div>
                )}

                {previews.length > 0 ? (
                    <div className={styles.previewList}>
                        {previews.map((item, index) => (
                            <div key={index} className={styles.previewItem}>
                                {item}
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description='暂无预览数据' />
                )}
            </Spin>
        </Modal>
    )
}

export default Index

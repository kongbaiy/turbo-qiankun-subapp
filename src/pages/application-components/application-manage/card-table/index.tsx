import { Button } from 'antd'
import styles from './index.module.scss'

import { ApplicationRecord } from '@/api/application-components/application-manage/index.interface'

interface Props {
    data: ApplicationRecord[]
}

const Index = (props: Props) => {
    const { data } = props

    return (
        <div className={styles.cardContainer}>
            {data.map((item: any) => (
                <div key={item.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardRow}>
                            {/* <img src='' alt='' className={styles.cardIcon} /> */}
                            <div className={styles.cardIconBox}>
                                <svg
                                    className='w-7 h-7 text-white'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                        stroke-width='2'
                                        d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                                    ></path>
                                </svg>
                            </div>

                            <div className={styles.cardStatus}>已发布1</div>
                        </div>
                        <p className={styles.cardTitle}>
                            应用名称：{item.appName}
                        </p>
                        <p className={styles.cardCode}>
                            应用编码: {item.appCode}
                        </p>
                    </div>

                    <div className={styles.cardMain}>
                        <div className='flex items-center'>
                            <div className={styles.cardVersion}>版本号</div>
                            <span className={styles.cardVersionText}>
                                版本 2.1.0
                            </span>
                        </div>
                        <div className={styles.cardDescription}>
                            租户管理、应用管理、资源管理、基础配置、权限管理等平台基础能力
                        </div>
                        <div className={`${styles.cardRow} mt-14px`}>
                            <span className={styles.cardData}>资源数：156</span>
                            <span className={styles.cardData}>
                                使用租户：156
                            </span>
                        </div>

                        <div className={styles.cardActions}>
                            <Button className={styles.detail}>详情</Button>
                            <Button className={styles.resourceConfig}>
                                资源配置
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Index

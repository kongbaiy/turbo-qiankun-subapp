import { useState } from 'react'
import { Card, Row, Col } from 'antd'

import { DimensionTypeItem } from './type'

import TypeManage from './type-manage'
import ValueManage from './value-manage'

const Index = () => {
    const [selectedType, setSelectedType] = useState<DimensionTypeItem>()

    const handleSelectType = (type: DimensionTypeItem) => {
        setSelectedType(type)
    }

    return (
        <div>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title='维度类型'>
                        <TypeManage
                            onSelectType={handleSelectType}
                            selectedTypeId={selectedType?.id}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        title={
                            selectedType
                                ? `维度值 - ${selectedType.typeName}${selectedType.isSystem === 1 ? '（系统维度）' : ''}`
                                : '维度值'
                        }
                    >
                        <ValueManage type={selectedType} />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Index

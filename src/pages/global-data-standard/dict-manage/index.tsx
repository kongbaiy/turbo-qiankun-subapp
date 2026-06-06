import { useState } from 'react'
import { Card, Row, Col } from 'antd'

import { DictCategoryItem } from './type'

import CategoryManage from './category-manage'
import ItemManage from './item-manage'

const Index = () => {
    const [selectedCategory, setSelectedCategory] = useState<DictCategoryItem>()

    const handleSelectCategory = (category: DictCategoryItem) => {
        setSelectedCategory(category)
    }

    return (
        <div>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title='字典分类'>
                        <CategoryManage
                            onSelectCategory={handleSelectCategory}
                            selectedCategoryId={selectedCategory?.id}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        title={
                            selectedCategory
                                ? `字典项 - ${selectedCategory.categoryName}`
                                : '字典项'
                        }
                    >
                        <ItemManage category={selectedCategory} />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Index

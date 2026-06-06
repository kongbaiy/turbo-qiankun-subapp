export interface DictCategoryItem {
    id: string
    categoryCode: string
    categoryName: string
    description?: string
    allowExtend: number
    status: number
    sortNo: number
    updatedAt?: string
}

export interface DictItemType {
    id: string
    categoryId: string
    categoryCode: string
    itemCode: string
    itemName: string
    parentId?: string
    parentName?: string
    itemValue?: string
    description?: string
    status: number
    sortNo: number
    updatedAt?: string
}

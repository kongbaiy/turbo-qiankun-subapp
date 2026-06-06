export interface DimensionTypeItem {
    id: string
    typeCode: string
    typeName: string
    description?: string
    isSystem: number
    status: number
    sortNo: number
    updatedAt?: string
}

export interface DimensionValueItem {
    id: string
    typeId: string
    typeCode: string
    valueCode: string
    valueName: string
    parentId?: string
    parentName?: string
    description?: string
    status: number
    sortNo: number
    updatedAt?: string
}

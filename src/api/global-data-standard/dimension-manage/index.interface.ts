export interface DimensionTypes {
    keyword?: string
    dimensionType?: string
    status?: string
}

export interface DimensionType {
    id: string
    typeCode: string
    typeName: string
    description?: string
    isSystem: number
    status: number
    sortNo: number
    createdAt?: string
    updatedAt?: string
}

export interface SaveDimensionType {
    id?: string
    typeCode: string
    typeName: string
    description?: string
    isSystem: number
    sortNo: number
    status: number
}

export interface DeleteDimensionType {
    id: string
}

export interface DimensionValues {
    keyword?: string
    typeId?: string
    parentId?: string
    status?: string
}

export interface DimensionValue {
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
    createdAt?: string
    updatedAt?: string
}

export interface SaveDimensionValue {
    id?: string
    typeId: string
    valueCode: string
    valueName: string
    parentId?: string
    description?: string
    sortNo: number
    status: number
}

export interface DeleteDimensionValue {
    id: string
}

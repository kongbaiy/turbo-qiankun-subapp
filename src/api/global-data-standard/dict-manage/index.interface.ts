export interface DictCategories {
    keyword?: string
    status?: string
}

export interface DictCategory {
    id: string
    categoryCode: string
    categoryName: string
    description?: string
    allowExtend: number
    status: number
    sortNo: number
    createdAt?: string
    updatedAt?: string
}

export interface SaveDictCategory {
    id?: string
    categoryCode: string
    categoryName: string
    description?: string
    allowExtend: number
    sortNo: number
    status: number
}

export interface DeleteDictCategory {
    id: string
}

export interface DictItems {
    keyword?: string
    categoryId?: string
    parentId?: string
    status?: string
}

export interface DictItem {
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
    createdAt?: string
    updatedAt?: string
}

export interface SaveDictItem {
    id?: string
    categoryId: string
    itemCode: string
    itemName: string
    parentId?: string
    itemValue?: string
    description?: string
    sortNo: number
    status: number
}

export interface DeleteDictItem {
    id: string
}

export interface ImportDict {
    categoryId: string
    file: File
}

export interface ExportDict {
    categoryId?: string
}

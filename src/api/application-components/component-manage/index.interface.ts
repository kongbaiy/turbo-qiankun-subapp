export interface Components {
    keyword?: string
    componentType?: string
    status?: string
}

export interface ComponentRecord {
    id: string
    componentName: string
    componentCode: string
    componentType: string
    description?: string
    propsSchema?: string
    defaultProps?: string
    status: number
    sortNo: number
    version: number
    createdAt?: string
    updatedAt?: string
}

export interface SaveComponent {
    id?: string
    componentName: string
    componentCode: string
    componentType: string
    description?: string
    propsSchema?: string
    defaultProps?: string
    sortNo: number
    status: number
    version?: number
}

export interface ComponentDetail {
    id: string
    componentName: string
    componentCode: string
    componentType: string
    description?: string
    propsSchema?: string
    defaultProps?: string
    status: number
    sortNo: number
    version: number
    createdAt: string
    updatedAt: string
}

export interface DeleteComponent {
    id: string
}

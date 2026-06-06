export interface Controls {
    keyword?: string
    controlType?: string
    controlCategory?: string
    status?: string
}

export interface ControlRecord {
    id: string
    controlName: string
    controlCode: string
    controlType: string
    controlCategory: string
    description?: string
    icon?: string
    baseProps?: ControlBaseProp[]
    extendProps?: ControlExtendProp[]
    status: number
    sortNo: number
    version: number
    createdAt?: string
    updatedAt?: string
}

export interface ControlBaseProp {
    propName: string
    propCode: string
    propType: string
    defaultValue?: string
    required: boolean
    description?: string
}

export interface ControlExtendProp {
    propName: string
    propCode: string
    propType: string
    defaultValue?: string
    required: boolean
    description?: string
}

export interface SaveControl {
    id?: string
    controlName: string
    controlCode: string
    controlType: string
    controlCategory: string
    description?: string
    icon?: string
    baseProps?: ControlBaseProp[]
    extendProps?: ControlExtendProp[]
    sortNo: number
    status: number
    version?: number
}

export interface DeleteControl {
    id: string
}

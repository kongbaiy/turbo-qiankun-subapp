export interface Forms {
    keyword?: string
    formType?: string
    status?: string
}

export interface FormRecord {
    id: string
    formName: string
    formCode: string
    formType: string
    description?: string
    dataAccessLevel: string
    fields?: FormField[]
    extendProps?: FormExtendProp[]
    status: number
    sortNo: number
    version: number
    createdAt?: string
    updatedAt?: string
}

export interface FormField {
    id: string
    fieldName: string
    fieldCode: string
    fieldType: string
    controlType: string
    required: boolean
    dataAccessLevel: string
    extendProps?: FieldExtendProp[]
    description?: string
    sortNo: number
}

export interface FormExtendProp {
    propName: string
    propCode: string
    propType: string
    defaultValue?: string
    required: boolean
    description?: string
}

export interface FieldExtendProp {
    propName: string
    propCode: string
    propType: string
    defaultValue?: string
    required: boolean
    description?: string
}

export interface SaveForm {
    id?: string
    formName: string
    formCode: string
    formType: string
    description?: string
    dataAccessLevel: string
    fields?: FormField[]
    extendProps?: FormExtendProp[]
    sortNo: number
    status: number
    version?: number
}

export interface DeleteForm {
    id: string
}

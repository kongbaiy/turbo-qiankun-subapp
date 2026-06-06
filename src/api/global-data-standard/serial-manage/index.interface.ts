export interface Serials {
    keyword?: string
    status?: string
}

export interface Serial {
    id: string
    serialCode: string
    serialName: string
    prefix?: string
    dateFormat?: string
    digitLength: number
    startValue: number
    step: number
    suffix?: string
    resetType: string
    description?: string
    status: number
    sortNo: number
    createdAt?: string
    updatedAt?: string
}

export interface SaveSerial {
    id?: string
    serialCode: string
    serialName: string
    prefix?: string
    dateFormat?: string
    digitLength: number
    startValue: number
    step: number
    suffix?: string
    resetType: string
    description?: string
    sortNo: number
    status: number
}

export interface DeleteSerial {
    id: string
}

export interface PreviewSerial {
    id: string
    count?: number
}

export interface SerialPreview {
    serialNo: string
    preview: string[]
}

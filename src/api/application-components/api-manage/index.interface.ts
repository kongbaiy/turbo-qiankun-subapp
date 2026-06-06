export interface Apis {
    keyword?: string
    apiType?: string
    method?: string
    status?: string
}

export interface ApiRecord {
    id: string
    apiName: string
    apiPath: string
    apiType: string
    method: string
    description?: string
    requestSchema?: string
    responseSchema?: string
    status: number
    sortNo: number
    version: number
    createdAt?: string
    updatedAt?: string
}

export interface SaveApi {
    id?: string
    apiName: string
    apiPath: string
    apiType: string
    method: string
    description?: string
    requestSchema?: string
    responseSchema?: string
    sortNo: number
    status: number
    version?: number
}

export interface ApiDetail {
    id: string
    apiName: string
    apiPath: string
    apiType: string
    method: string
    description?: string
    requestSchema?: string
    responseSchema?: string
    status: number
    sortNo: number
    version: number
    createdAt: string
    updatedAt: string
}

export interface DeleteApi {
    id: string
}

export interface ApiLog {
    id: string
    apiId: string
    requestTime: string
    responseTime: string
    duration: number
    requestParams?: string
    responseData?: string
    statusCode: number
    errorMessage?: string
    clientIp?: string
    userAgent?: string
    createdAt: string
}

export interface ApiLogs {
    apiId: string
    startTime?: string
    endTime?: string
    statusCode?: number
    page?: number
    pageSize?: number
}

export interface ApiItem {
    id: string
    apiName: string
    apiPath: string
    apiType: string
    method: string
    description?: string
    status: number
    sortNo: number
    version: number
    updatedAt?: string
}

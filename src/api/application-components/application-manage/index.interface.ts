export interface Applications {
    keyword?: string
    platformCode?: string
    status?: string
}

export interface ApplicationRecord {
    id: string
    platformId: string
    platformCode: string
    appCode: string
    appName: string
    appType: string
    entryUrl: string
    iconType: string
    iconValue: string
    appStatus: string
}

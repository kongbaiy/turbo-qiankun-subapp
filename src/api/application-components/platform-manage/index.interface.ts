export interface Platforms {
    keyword?: string
    clientType?: string
    status?: string
}
export interface SavePlatform {
    id: string
    platformCode: string
    platformName: string
    clientType: string
    entryUrl: string
    loginMethods: string
    sortNo: number
    platformStatus: string
    version: number
}

export interface PlatformDetail {
    id: string
    name: string
    code: string
    entryUrl: string
    loginType: string
    status: number
    createdAt: string
    updatedAt: string
}

export interface CreatePlatform {
    name: string
    code: string
    entryUrl: string
    loginType: string
    status: number
}

export interface UpdatePlatform extends CreatePlatform {
    id: string
}

export interface DeletePlatform {
    id: string
}

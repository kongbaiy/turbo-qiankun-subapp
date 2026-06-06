import { api } from '@repo/utils'

import type {
    Platforms,
    SavePlatform,
    PlatformDetail,
    CreatePlatform,
    UpdatePlatform,
    DeletePlatform,
} from './index.interface'

export const getPlatforms = (params?: Platforms) =>
    api.get('/admin/basic/platforms', { params })

export const savePlatform = (params?: SavePlatform) =>
    api.post('/admin/basic/platforms', params)

export const getPlatformDetail = (params: Platforms) =>
    api.get<PlatformDetail>('/admin/basic/platform/detail', { params })

export const createPlatform = (data: CreatePlatform) =>
    api.post('/admin/basic/platform', data)

export const updatePlatform = (data: UpdatePlatform) =>
    api.put('/admin/basic/platform', data)

export const deletePlatform = (params: DeletePlatform) =>
    api.delete('/admin/basic/platform', { params })

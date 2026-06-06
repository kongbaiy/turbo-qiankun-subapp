import { api } from '@repo/utils'

import type {
    Apis,
    SaveApi,
    ApiDetail,
    DeleteApi,
    ApiLogs,
} from './index.interface'

export const getApis = (params?: Apis) =>
    api.get('/admin/basic/apis', { params })

export const saveApi = (params?: SaveApi) =>
    api.post('/admin/basic/apis', params)

export const getApiDetail = (params: Apis) =>
    api.get<ApiDetail>('/admin/basic/api/detail', { params })

export const deleteApi = (params: DeleteApi) =>
    api.delete('/admin/basic/api', { params })

export const getApiLogs = (params: ApiLogs) =>
    api.get('/admin/basic/api/logs', { params })

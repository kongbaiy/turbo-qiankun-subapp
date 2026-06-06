import { api } from '@repo/utils'

import type {
    Controls,
    SaveControl,
    ControlRecord,
    DeleteControl,
} from './index.interface'

export const getControls = (params?: Controls) =>
    api.get('/admin/basic/controls', { params })

export const saveControl = (params?: SaveControl) =>
    api.post('/admin/basic/controls', params)

export const getControlDetail = (params: { id: string }) =>
    api.get<ControlRecord>('/admin/basic/control/detail', { params })

export const deleteControl = (params: DeleteControl) =>
    api.delete('/admin/basic/control', { params })

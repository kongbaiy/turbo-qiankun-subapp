import { api } from '@repo/utils'

import type {
    Serials,
    SaveSerial,
    DeleteSerial,
    PreviewSerial,
} from './index.interface'

export const getSerials = (params?: Serials) =>
    api.get('/admin/basic/serials', { params })

export const saveSerial = (params?: SaveSerial) =>
    api.post('/admin/basic/serial', params)

export const deleteSerial = (params: DeleteSerial) =>
    api.delete('/admin/basic/serial', { params })

export const previewSerial = (params: PreviewSerial) =>
    api.get('/admin/basic/serial/preview', { params })

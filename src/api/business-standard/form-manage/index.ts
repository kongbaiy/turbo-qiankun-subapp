import { api } from '@repo/utils'

import type {
    Forms,
    SaveForm,
    FormRecord,
    DeleteForm,
} from './index.interface'

export const getForms = (params?: Forms) =>
    api.get('/admin/basic/forms', { params })

export const saveForm = (params?: SaveForm) =>
    api.post('/admin/basic/forms', params)

export const getFormDetail = (params: { id: string }) =>
    api.get<FormRecord>('/admin/basic/form/detail', { params })

export const deleteForm = (params: DeleteForm) =>
    api.delete('/admin/basic/form', { params })

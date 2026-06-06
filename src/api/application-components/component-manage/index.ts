import { api } from '@repo/utils'

import type {
    Components,
    SaveComponent,
    ComponentDetail,
    DeleteComponent,
} from './index.interface'

export const getComponents = (params?: Components) =>
    api.get('/admin/basic/components', { params })

export const saveComponent = (params?: SaveComponent) =>
    api.post('/admin/basic/components', params)

export const getComponentDetail = (params: Components) =>
    api.get<ComponentDetail>('/admin/basic/component/detail', { params })

export const deleteComponent = (params: DeleteComponent) =>
    api.delete('/admin/basic/component', { params })

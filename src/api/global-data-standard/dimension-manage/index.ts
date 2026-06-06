import { api } from '@repo/utils'

import type {
    DimensionTypes,
    SaveDimensionType,
    DeleteDimensionType,
    DimensionValues,
    SaveDimensionValue,
    DeleteDimensionValue,
} from './index.interface'

export const getDimensionTypes = (params?: DimensionTypes) =>
    api.get('/admin/basic/dimension/types', { params })

export const saveDimensionType = (params?: SaveDimensionType) =>
    api.post('/admin/basic/dimension/type', params)

export const deleteDimensionType = (params: DeleteDimensionType) =>
    api.delete('/admin/basic/dimension/type', { params })

export const getDimensionValues = (params?: DimensionValues) =>
    api.get('/admin/basic/dimension/values', { params })

export const saveDimensionValue = (params?: SaveDimensionValue) =>
    api.post('/admin/basic/dimension/value', params)

export const deleteDimensionValue = (params: DeleteDimensionValue) =>
    api.delete('/admin/basic/dimension/value', { params })

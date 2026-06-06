import { api } from '@repo/utils'

import type {
    DictCategories,
    SaveDictCategory,
    DeleteDictCategory,
    DictItems,
    SaveDictItem,
    DeleteDictItem,
    ImportDict,
    ExportDict,
} from './index.interface'

export const getDictCategories = (params?: DictCategories) =>
    api.get('/admin/basic/dict/categories', { params })

export const saveDictCategory = (params?: SaveDictCategory) =>
    api.post('/admin/basic/dict/category', params)

export const deleteDictCategory = (params: DeleteDictCategory) =>
    api.delete('/admin/basic/dict/category', { params })

export const getDictItems = (params?: DictItems) =>
    api.get('/admin/basic/dict/items', { params })

export const saveDictItem = (params?: SaveDictItem) =>
    api.post('/admin/basic/dict/item', params)

export const deleteDictItem = (params: DeleteDictItem) =>
    api.delete('/admin/basic/dict/item', { params })

export const importDict = (params: ImportDict) => {
    const formData = new FormData()
    formData.append('categoryId', params.categoryId)
    formData.append('file', params.file)
    return api.post('/admin/basic/dict/import', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export const exportDict = (params?: ExportDict) =>
    api.get('/admin/basic/dict/export', {
        params,
        responseType: 'blob',
    })

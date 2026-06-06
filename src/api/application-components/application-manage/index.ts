import { api } from '@repo/utils'

import type { Applications } from './index.interface'

export const getApplications = (params?: Applications) =>
    api.get('/admin/basic/apps', { params })

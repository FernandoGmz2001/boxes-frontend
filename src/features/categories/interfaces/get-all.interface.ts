import type { IPage, IPaginationParams } from '@/shared/interfaces/page.interface.ts'
import type { IGetCategory } from './get.interface.ts'

export type IGetAllCategoriesParams = IPaginationParams

export type IGetAllCategories = IPage<IGetCategory>

import { Router } from 'express'
import { getAllCategories, createCategory, getCategoryById, updateCategory, deleteCategory } from '../controllers/assetCategoryController.js'
import { authenticate, requirePermission } from '../middleware/auth.js'
import { validate } from '../utils/validation.js'
import { assetCategorySchema, assetCategoryUpdateSchema } from '../validators/orgSchemas.js'

const router = Router()

router.use(authenticate)

router.get('/', requirePermission('asset:read'), getAllCategories)
router.post('/', requirePermission('asset:create'), validate(assetCategorySchema), createCategory)
router.get('/:id', requirePermission('asset:read'), getCategoryById)
router.put('/:id', requirePermission('asset:update'), validate(assetCategoryUpdateSchema), updateCategory)
router.delete('/:id', requirePermission('asset:delete'), deleteCategory)

export default router

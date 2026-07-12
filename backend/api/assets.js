import { Router } from 'express'
import { getAllAssets, createAsset, getAssetById, updateAsset, searchAssets } from '../controllers/assetController.js'

const router = Router()

router.get('/', getAllAssets)
router.get('/search', searchAssets) // Must be before /:id
router.post('/', createAsset)
router.get('/:id', getAssetById)
router.put('/:id', updateAsset)

export default router

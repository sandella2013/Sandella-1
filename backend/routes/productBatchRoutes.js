import express from 'express'
const router = express.Router()
import {
  getAllBatches,
  createBatch,
  getSingleBatch,
  removeBatch,
  updateBatch,
  updateMaterialsBatches,
  totalCost
} from '../controllers/productBatchesController.js'

import { protect,admin } from '../middleware/authMiddleware.js'

router
  .route('/')
  .get(protect,admin, getAllBatches)
  .post(protect,admin, createBatch)
  

router.get('/total',protect,admin, totalCost)

router.route('/:id').get(protect,admin, getSingleBatch).put(protect,admin, updateBatch)

export default router

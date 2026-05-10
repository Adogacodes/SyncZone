import express from 'express'
import {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  seedMembers,
} from '../controllers/memberController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/',      getMembers)
router.post('/',     createMember)
router.post('/seed', seedMembers)
router.put('/:id',   updateMember)
router.delete('/:id', deleteMember)

export default router
const express = require('express')
const router = express.Router()

const {
  createReview,
  getReview,
  getAllReviews,
  getTopPerforming
} = require('../controllers/review')

router.route('/').post(createReview)
router.route('/all').get(getTopPerforming)
router.route('/:managerId/:employeeId').get(getReview)
router.route('/:employeeId').get(getAllReviews)

module.exports = router

const express = require('express')
const router = express.Router()

const {
    updateTechnology,
    createTechnology,
    getTechnology
} = require('../controllers/technology')

router.route('/').post(createTechnology).get(getTechnology)
router.route('/:id').patch(updateTechnology)

module.exports = router
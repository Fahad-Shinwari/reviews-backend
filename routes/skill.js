const express = require('express')
const router = express.Router()

const {
    updateSkill,
    createSkill,
    getSkill
} = require('../controllers/skills')

router.route('/').post(createSkill)
router.route('/:id').patch(updateSkill).get(getSkill)

module.exports = router
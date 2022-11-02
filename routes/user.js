const express = require('express')
const router = express.Router()

const {
    changePassword,
    login,
    register,
    getSingleUser,
    getAllEmployees,
    getAllManagers,
    getSingleUserData,
    getTodayReviewUsers,
    getEmployees,
    updateUser
} = require('../controllers/users')

router.route('/login').post(login)
router.route('/all').get(getAllEmployees)
router.route('/employees/all').get(getEmployees)
router.route('/managers/:id').get(getAllManagers)
router.route('/change-password').post(changePassword)
router.route('/register').post(register)
router.route('/:id').get(getSingleUser)
router.route('/edit/:id').put(updateUser)
router.route('/single/:id').get(getSingleUserData)
router.route('/review/today').get(getTodayReviewUsers)

module.exports = router
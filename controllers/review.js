const Review = require('../models/Review')
const User = require('../models/User')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')
const { Types } = require('mongoose');   
const moment = require('moment/moment');

const createReview = asyncWrapper(async (req, res) => {
  const review = await Review.create(req.body)
  res.status(201).json({ review })
})

const getReview = asyncWrapper(async (req, res, next) => {
  const manager = req.params.managerId 
  const employee = req.params.employeeId 
  const review = await Review.find({ employeeId: employee,managerId:manager,admin:false })
// .find({ employeeId: employee,managerId:manager,admin:false })
  if (!review) {
    return next(createCustomError(`No Review with id`, 404))
  }

  res.status(200).json({ review })
})

const getTopPerforming = asyncWrapper(async (req, res, next) => {
  const end = moment().toDate(); 
  const start = moment().startOf('day').subtract(30, 'day').toDate();
  console.log(end,start)
  const review = await Review.aggregate([
    {
        $match: {
          createdAt: { $gte: start, $lte: end }
       }
    }])
// .find({ employeeId: employee,managerId:manager,admin:false })
  if (!review) {
    return next(createCustomError(`No Review with id`, 404))
  }

  res.status(200).json({ review })
})

const getAllReviews = asyncWrapper(async (req, res, next) => {
  const employee = req.params.employeeId 
  const review = await Review.aggregate([{
    $lookup: {
            from: 'users',
            localField: "managerId",
            foreignField: "_id",
            as: "skills"
        }
},{
  $match: {
    employeeId: Types.ObjectId(employee)
  }
}])
  if (!review) {
    return next(createCustomError(`No Review with id`, 404))
  }

  res.status(200).json({ review })
})



module.exports = {
  createReview,
  getReview,
  getAllReviews,
  getTopPerforming
}

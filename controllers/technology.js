const Technology = require('../models/Technology')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

const createTechnology = asyncWrapper(async (req, res) => {
  const technology = await Technology.create(req.body)
  res.status(201).json({ technology })
})

const updateTechnology = asyncWrapper(async (req, res, next) => {
  const { id: technologyID } = req.params

  const technology = await Technology.findOneAndUpdate({ _id: technologyID }, req.body, {
    new: true,
    runValidators: true,
  })

  if (!technology) {
    return next(createCustomError(`No category with id : ${technologyID}`, 404))
  }

  res.status(200).json({ technology })
})

const getTechnology = asyncWrapper(async (req, res) => {
  const technology = await Technology.find({})
  res.status(200).json({ technology })
})

module.exports = {
  updateTechnology,
  createTechnology,
  getTechnology
}
const Skill = require('../models/Skill')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

const createSkill = asyncWrapper(async (req, res) => {
  const skill = await Skill.create(req.body)
  res.status(201).json({ skill })
})

const updateSkill = asyncWrapper(async (req, res, next) => {
  const { id: skillID } = req.params

  const skill = await Skill.findOneAndUpdate({ _id: skillID }, req.body, {
    new: true,
    runValidators: true,
  })

  if (!skill) {
    return next(createCustomError(`No category with id : ${skillID}`, 404))
  }

  res.status(200).json({ skill })
})

const getSkill = asyncWrapper(async (req, res) => {
  const skill = await Skill.find()
  res.status(200).json({ skill })
})

module.exports = {
  updateSkill,
  createSkill,
  getSkill
}
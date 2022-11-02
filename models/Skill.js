const mongoose = require('mongoose')

const SkillSchema = new mongoose.Schema({
  skills: {
    type: Array,
  },
})

module.exports = mongoose.model('Skill', SkillSchema)

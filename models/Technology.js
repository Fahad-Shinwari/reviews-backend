const mongoose = require('mongoose')

const TechnologySchema = new mongoose.Schema({
  technologies: {
    type: String,
  },
  skillName: {
    type: Array
  }
})

module.exports = mongoose.model('Technology', TechnologySchema)

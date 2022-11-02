const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  comment: {
    type: String,
  },
  review: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false
  },
  supporting: {
    type: mongoose.Schema.Types.ObjectId,
  },
  skills: {
    type: Array,
  },
  technologies: {
    type: Array,
  },
  employeeName: {
    type: String,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  ratingValue: {
    type: Number
  }
},{ timestamps: true },
)

module.exports = mongoose.model('Review', ReviewSchema)

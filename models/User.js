const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: {
      type: String,
      required:true
    },
    data: {
      type: Array
    },
    employees: {
      type: Array
    },
    active: {
      type: String,
    },
    manager: {
      type: String,
    },
    supporting: {
      type: String,
    }
},
{ collection: 'users' })

module.exports = mongoose.model('User', UserSchema)
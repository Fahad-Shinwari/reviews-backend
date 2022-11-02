const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

const changePassword = asyncWrapper(async (req, res, next) => {
    const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return next(createCustomError(`Invalid password`, 404))
	}

	if (plainTextPassword.length < 5) {
		return next(createCustomError(`Password too small. Should be atleast 6 characters`, 404))
	}

	try {
		const user = jwt.verify(token, process.env.JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		return next(createCustomError(`${error}`, 404))
	}
})

const login = asyncWrapper(async (req, res, next) => {
	const { username, password } = req.body
	let user = await User.findOne({ username })
	
	if (!user) {
        return next(createCustomError(`Invalid username/password`, 404))
	}

	if (await bcrypt.compare(password, user.password)) {
		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			process.env.JWT_SECRET
		)
		console.log(user);
		const permissions = user.permissions
		return res.json({ status: 'ok', data: token,user,permissions })
	}
    return next(createCustomError(`Invalid username/password`, 404))
})

const register = asyncWrapper(async (req, res) => {
	const { username, password: plainTextPassword,role,data,employees,manager,active,supporting } = req.body

	if (!username || typeof username !== 'string') {
        return next(createCustomError(`Invalid username`, 404))
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return next(createCustomError(`Invalid password`, 404))        
	}

	if (plainTextPassword.length < 5) {
        return next(createCustomError(`Password too small. Should be atleast 6 characters`, 404))        
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			username,
			password,
      role,
      data,
      employees,
			manager,
			active,
			supporting
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
            return next(createCustomError(`Username already in use`, 404))
		}
		throw error
	}

	res.json({ status: 'A New User Has Been Created' })
})

const updateUser = asyncWrapper(async (req, res, next) => {
	const { id: userID } = req.params

	const user = await User.findOneAndUpdate({ _id: userID }, req.body, {
		new: true,
		runValidators: true,
	})

	if (!user) {
		return next(createCustomError(`No category with id : ${userID}`, 404))
	}

	res.status(200).json({ user })
})

const getAllUsers = asyncWrapper(async (req, res) => {
    const user = await User.find({ _id: { $ne: req.params.id } }).sort({_id: -1}).select(['-password'])
    res.status(200).json({ user })
})

const getAllEmployees = asyncWrapper(async (req, res) => {
    const user = await User.find().sort({_id: -1}).select(['-password'])
    res.status(200).json({ user })
})

const getEmployees = asyncWrapper(async (req, res) => {
	const user = await User.find({role: 'employee'}).sort({_id: -1}).select(['-password'])
	res.status(200).json({ user })
})

const getAllManagers = asyncWrapper(async (req, res) => {
  const user = await User.find({ _id: { $ne: req.params.id },role: 'manager'}).sort({_id: -1}).select(['-password'])
  res.status(200).json({ user })
})

const getTodayReviewUsers = asyncWrapper(async (req, res, next) => {
	var today = new Date();
	var day = today.getDay();
	var daylist = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	let todayDate = await daylist[day]
	try {
		const user = await User.find().select(['-password'])
	
	if (!user) {
			return next(createCustomError(`No task with id `, 404))
	}
	// const userList = await User.find({ $filter : { $eq: [ day, 'Tuesday' ] } })
	let	skill = await user.map(u=>u.data.filter(s=>s.day))
	// console.log(user)
	const review = await User.aggregate([
  {
      $match:{$expr:{$in:[todayDate,"$data.day"]}},
  }])
	if(review) {
		res.status(200).json({ review })
	}
} catch(error) {
		console.error("ERROR:" + error);
}
	
	// console.log(userList)
	
})

const getSingleUser = asyncWrapper(async (req, res, next) => {
    const { id: userID } = req.params
    const user = await User.findOne({ _id: userID }).select(['-password'])

    if (!user) {
        return next(createCustomError(`No task with id : ${userID}`, 404))
    }
    const userList = await User.find({ username : { $in : user.employees } })
    // console.log(userList)
    res.status(200).json({ user,userList })
})

const getSingleUserData = asyncWrapper(async (req, res, next) => {
  const { id: userID } = req.params
  const user = await User.findOne({ _id: userID }).select(['-password'])

  if (!user) {
      return next(createCustomError(`No task with id : ${userID}`, 404))
  }
  // console.log(userList)
  res.status(200).json({ user })
})

module.exports = {
  changePassword,
  login,
  register,
	getAllUsers,
	getSingleUser,
  getAllEmployees,
  getAllManagers,
  getSingleUserData,
	getTodayReviewUsers,
	getEmployees,
	updateUser
  }
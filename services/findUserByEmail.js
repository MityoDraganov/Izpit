const userModel = require('../models/userModel')

exports.findUserByEmail = async (username) => {
    const user = await userModel.find({username: username})
    return user
}
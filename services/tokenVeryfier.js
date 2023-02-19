const jwt = require('../lib/jwtPromisifier')
const secret = 'SomePrivateSecret'

exports.verifyToken = async (token) => {
    const decoded = await jwt.verify(token, secret)
    return decoded
}


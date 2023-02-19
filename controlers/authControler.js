const mongoose = require('mongoose')
const bycrypt = require('bcrypt')

const jwtPromises = require('../lib/jwtPromisifier')

const secret = 'SomePrivateSecret'

const usersModel = require('../models/userModel')

const onlyLetters = /^[a-zA-Z]+$/

const validator = require('validator')
const { getErrorMessage } = require('../utils/errorUtils')

async function findOneUser(email){
    const user = await  usersModel.findOne({username: email})
    return user
}

async function registerPOST (req, res){
    const { username, email, password, rePassword} = req.body
    
    //check if passwords match
    if(password !== rePassword){
        return res.render('register', {error: "Passwords does not match"})
    }
    
   // if(!onlyLetters.test(firstName) || !onlyLetters.test(lastName)){
    //    return res.render('login', {error: "Only letters are alowed in first and last names"})
   // }

    //if(firstName.length < 3 || lastName.length < 5){
     //   return res.render('register', {error: "First name should be at least 3 letters nad last name at least five"})
    //}

    if(!validator.isEmail(email)){
        return res.render('register', {error: "Invalid email"})
    }

    //check if username already exists
    //const isTaken = await findOneUser(username)
    //if(isTaken !== null){
    //    res.status(404).end()
    //} else{

    bycrypt.hash(password, 10).then(function(hash){
        //const user = new usersModel({firstName, lastName, email, password:hash})
        usersModel.create({username, email, password: hash})
        //user.save()
    })
    //}

    const token = await jwtPromises.sign({username}, secret)
    res.cookie('user', token)
    
    res.redirect('/')
}

async function loginPOST (req, res){
    const {username, password} = req.body

    //check if username already exists
    const user = await findOneUser(username)


    //chech if there is such user
    if(user === null){
        return res.render('login', {error: "No such user or wrong password"})

    }

    const hash = user.password


    const match = await bycrypt.compare(password, hash)


    //chech if password matches to user
    if(match){
        try{
        const token = await jwtPromises.sign({username}, secret)
        res.cookie('user', token)
        res.redirect('/')
        } catch(error){
            return res.status(404).render('login', {error: getErrorMessage(error)})
        }

    }else{
        res.status(404).end()
    }
}

//logout and clear cookie
async function logoutGET (req, res){
    res.clearCookie('user')
    res.redirect('/')
}

/*
async function logoutPOST (req, res){
    
}
*/

module.exports = {registerPOST, loginPOST, logoutGET}








/*
                                                                            !!!!!!!!!!!!!!!!!!!! !!!!!!!!!!!!!!!!!!!!
USE THIS WITH EVERY AWAIT CHECK Up


        try{
            const token = await jwtPromises.sign({email}, secret)
            res.cookie('user', token)
            res.redirect('/')
        } catch(error){
            return res.status(404).render('login', {error: getErrorMessage(error)})
        }



                                                                         !!!!!!!!!!!!!!!!!!!! !!!!!!!!!!!!!!!!!!!!

    ++++
    Check if error is passed in the TEMPLATE ex:(login.hbs)

*/
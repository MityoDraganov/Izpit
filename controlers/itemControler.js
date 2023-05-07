const itemModel = require('../models/itemModel')
const secret = 'SomePrivateSecret'
const validator = require('validator');
const userModel = require('../models/userModel');

const IMAGE_PATTERN = /^https?:\/\//;

const { getErrorMessage } = require('../utils/errorUtils');

const {verifyToken} = require('../services/tokenVeryfier')

const {findUserByUsername} = require('../services/findUserByEmail');


async function itemCretion(req, res){
    try{

    const token = req.cookies['user'];
    const decodedToken = await verifyToken(token)
    console.log(decodedToken)
    const username = decodedToken.username
    //console.log('email')
    //console.log(email)

    console.log(req.body)
    const {name, image, location, age, description} = req.body

    if(name.length < 2){
       return res.render('create', {error: 'Name too short'})
    }
    if(age.length < 1 || age.length > 100){
        return res.render('create', {error: 'Invalid age'})
    }
    if(description.length < 5 || description.length > 50){
        return res.render('create', {error: 'Invalid description'})
    }
    if(location.length < 5 || location.length > 50){
        return res.render('create', {error: 'Invalid location'})
    }

    if(!IMAGE_PATTERN.test(image)){
        return res.render('create', {error: 'Invalid image link'})
    }
    /*
    if(title.length < 6 || keyword.length < 6){

    }

    if(location.length > 15){

    }

    if(dateOfCreation.length !== 10){

    }

    if(description.length < 8){

    }

    if(!validator.isURL(image)){

    }
    */
    const user =  await userModel.find({username: username}).lean()
    console.log(user)
    const author = user[0]._id


    await itemModel.create({name, image, location, age, description, author})
    .then(res.redirect('/dashboard'))

    } catch(error){
        return res.status(404).render('create', {error: getErrorMessage(error)})
    }
}

async function itemEdit(req,res){
    //try{
    const itemId = req.params.id
    const item = await itemModel.findById(itemId)
    console.log(itemId)
    console.log('body')
    console.log(itemId)
    const {name, image, location, age, description} =  req.body
    console.log(name, image, location, age, description)
    //await itemModel.findByIdAndUpdate(itemId, {name: name, image: image, age: age , description: description, location: location})
    item.name = name
    item.image = image
    item.location = location
    item.age = age
    item.description = description
    item.save()
    //item.
    res.redirect(`/details/${itemId}`)
    //} catch(err){
    //    return res.status(404).render('edit', {error: getErrorMessage(error)})
    //}

}

async function itemDelete(req,res){
    try{
    const itemId = req.params.id

    await itemModel.findByIdAndDelete(itemId)
    res.redirect('/dashboard')
    } catch(err){
        
    }
}

async function itemVoteUP(req, res){
    const itemId = req.params.id
    const item = await itemModel.findById(itemId)

    const token = req.cookies['user'];
    const decodedToken = await verifyToken(token)
    
    const user = await findUserByEmail(decodedToken.email)
    const userId = user[0]._id

    item.upVotes.push(userId)
    item.votesOnPost.push(userId)
    item.ratingOnPost += 1
    await item.save()

    res.redirect('/')
}


async function itemVoteDOWN(req, res){
    const itemId = req.params.id
    const item = await itemModel.findById(itemId)

    const token = req.cookies['user'];
    const decodedToken = await verifyToken(token)
    
    const user = await userModel.find({username: decodedToken.username}).lean()
    const userId = user[0]._id

    item.ratingOnPost -= 1
    item.votesOnPost.push(userId)
    item.downVotes.push(userId)
    await item.save()

    res.redirect('/')
}

async function commentPhoto(req,res){
    const itemId = req.params.id
    const item = await itemModel.findById(itemId)
    console.log(item)
    const comment = req.body.comment


    const token = req.cookies['user'];
    const decodedToken = await verifyToken(token)
    
    const user = await userModel.find({username: decodedToken.username}).lean()
    const userId = user[0]._id

    item.commentList.push({userId: userId, comment:comment})
    await item.save()
    //const item = 

    console.log('comented')
    res.redirect(`/details/${itemId}`)
}

module.exports = {itemCretion, itemEdit, itemDelete, itemVoteUP, itemVoteDOWN, commentPhoto}
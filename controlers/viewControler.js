const itemModel = require('../models/itemModel')

const userModel = require('../models/userModel')

const {verifyToken} = require('../services/tokenVeryfier')
//views

//home
async function homeView(req,res){
    res.render('home')
}
//about
async function dashboardView(req,res){
    const items = await itemModel.find().populate('author').lean()

    console.log(items)
    res.render('catalog', {items})
}


async function detailsView(req,res){
    const id = req.params.id

    const item =   await itemModel.findById(id).populate('author').populate({
        path: 'commentList.userId',
        select:'username'
    }).lean()
    const comments = item.commentList
    const toSendComments = []

    //comments.forEach(element =>{
    //    const user = await userModel.findById(element.userId)
    //    console.log(user)
    //})

    console.log(comments)
    const token = req.cookies['user'];

    console.log('item')
    console.log(item)
    const author = item.author
    //const ratingOnPost = item.ratingOnPost
    //let votedEmails = []
    //if(item.votesOnPost){
    //    item.votesOnPost.forEach(element => {
    //         votedEmails.push(element.email)
    //    })
    //}

    //console.log(votedEmails)
    //owner
    //basic user
    //notLogged
    let isOwner = false;
    let isBasicUser = false;
    let userVoted = false;
    let notLogged = false;


    if(token){
    const decodedToken = await verifyToken(token)


    console.log('currentUser')
    const currentUser = await userModel.findOne({username: decodedToken.username})
    console.log(currentUser)
    console.log(author)

    
    if(author.email == currentUser.email){
        isOwner = true
    } else if(currentUser){
        isBasicUser = true
    } else {
        notLogged = true
    }


}


    res.render('details', {item, isOwner, isBasicUser})

}

//edit / delete

async function editView(req,res){
    const itemId = req.params.id

    const item = await itemModel.findById(itemId).lean()

    res.render('edit', {item})
}

//auth
async function registerView(req,res){
    res.render('register')
}
async function loginView(req,res){
    res.render('login')
}

async function createView(req,res){
    res.render('create')
}


async function profileView(req,res){

    const token = req.cookies['user'];
    const decodedToken = await verifyToken(token)

    const userUsername = decodedToken.username


    
    const user = await userModel.find({username: userUsername}).lean()

    const myUser = user[0]

    const photos = await itemModel.find({author: myUser._id}).lean()

    const photosCount = photos.length
    console.log(photos)
    //console.log(myUser)
    //console.log(userUsername)
    res.render('profile', {myUser, photos, photosCount})
}

module.exports = {homeView, registerView, loginView, dashboardView, createView, detailsView, editView, profileView}
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
    console.log('id')
    console.log(id);
    const item =   await itemModel.findById(id).populate('author').populate('commentList').lean()
    const token = req.cookies['user'];
    console.log(token)
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
    console.log('author')
    console.log(author)

    
    if(author.email == currentUser.email){
        isOwner = true
    } else if(currentUser){
        isBasicUser = true
    } else {
        notLogged = true
    }

    return res.render('details', {item, isOwner, isBasicUser})
} else{

    return res.render('details', {item})
}



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

module.exports = {homeView, registerView, loginView, dashboardView, createView, detailsView, editView}
const router = require('express').Router()

const authControler = require('./controlers/authControler')
const viewControler = require('./controlers/viewControler')
const itemControler = require('./controlers/itemControler')
const {authentication, isAuthenticated, notForUsers} = require('./middlewears/authMiddleware')
//router.METHOD('URL', CALLBACK)



//VIEWS

//home
router.get('/', authentication ,viewControler.homeView)
//dashboard
router.get('/dashboard',authentication, viewControler.dashboardView)

//auth views
router.get('/register',authentication, notForUsers, viewControler.registerView)
router.get('/login',authentication, notForUsers,  viewControler.loginView)

//create
router.get('/create',authentication,isAuthenticated, viewControler.createView)

//details

router.get('/details/:id', authentication ,viewControler.detailsView)

// edit
router.get('/edit/:id', authentication, isAuthenticated, viewControler.editView)

//CRUD

//auth crud
router.get('/logout', authentication, isAuthenticated, authControler.logoutGET)
router.post('/register', authentication, notForUsers, authControler.registerPOST)
router.post('/login', authentication, notForUsers, authControler.loginPOST)


//item crud
router.post('/create',authentication,isAuthenticated, itemControler.itemCretion)
router.post('/edit/:id',authentication,isAuthenticated, itemControler.itemEdit)
router.get('/delete/:id',authentication,isAuthenticated, itemControler.itemDelete)



router.post('/comment/:id', authentication,isAuthenticated, itemControler.commentPhoto)


module.exports = router
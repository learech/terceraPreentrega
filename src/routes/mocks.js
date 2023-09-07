const {Router} = require('express')
const router = new Router()
const {mockProducts,mockUsers,mockGetError} = require('../controllers/mocks.js')



router.get('/products', mockProducts)
router.get('/users',mockUsers) 
router.get('*', mockGetError)

module.exports = router
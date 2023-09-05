const express = require('express')
const passport = require('passport')
const router = express.Router()
const decodForm = express.urlencoded({ extended: true })
const { login, authloginsession, formNewUser, dataCurrent, errorRegister, logout } = require('../controllers/sessions')

router.get('/', login)
router.get('/errorregister', errorRegister)
router.get('/current', authloginsession, dataCurrent)
router.get('/register', formNewUser)
router.get('/logout', logout);
    
router.post('/register', decodForm, passport.authenticate('register', { failureRedirect: '/api/errorregister' }), (req, res) => {
    res.render('registersuccefully', {
        name: req.body.first_name
    });
});

router.post('/login', decodForm, passport.authenticate('login', { failureRedirect: '/' }), (req, res) => {
    res.status(200).redirect('/api/current');
})

router.get('/auth/github', passport.authenticate('auth-github', { scope: ['user:email'] }));

router.get('/auth/github/callback', passport.authenticate('auth-github', { failureRedirect: '/' }), (req, res) => {
    req.session.user = req.user
    res.status(200).redirect('/api/current');
});

module.exports = router;
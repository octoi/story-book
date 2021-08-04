const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const { ensureAuth } = require('../middlewares/auth');

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/')
    } catch (err) {
        console.log(`[-] Failed to post story`)
        console.log(err)
    }
})

module.exports = router;
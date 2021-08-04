const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middlewares/auth');

const Story = require('../models/Story');

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.log(`[-] Failed to create story`)
        console.error(err)
        res.render('error/500')
    }
})

router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        console.log(stories)

        res.render('stories/index', {
            stories,
        })
    } catch (err) {
        console.log(`[-] Failed to get stories`)
        console.error(err)
        res.render('error/500')
    }
})


module.exports = router;
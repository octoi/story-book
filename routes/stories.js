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

        res.render('stories/index', { stories })
    } catch (err) {
        console.log(`[-] Failed to get stories`)
        console.error(err)
        res.render('error/500')
    }
})

router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({ _id: req.params.id }).lean()

        if (!story) return res.render('error/404');
        if (story.user != req.user.id) return res.redirect('/stories');

        res.render('stories/edit', { story })

    } catch (err) {
        console.log(`[-] Failed to get story`)
        console.error(err)
        res.render('error/500')
    }
})

router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean();

        if (!story) return res.render('error/404');
        if (story.user != req.user.id) return res.redirect('/stories')

        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        })

        res.redirect('/dashboard')

    } catch (err) {
        console.log(`[-] Failed to get story`)
        console.error(err)
        res.render('error/500')
    }
})

router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story) return res.render('error/404')
        if (story.user != req.user.id) res.redirect('/stories')

        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.log('[-] Failed to delete story')
        console.error(err)
        return res.render('error/500')
    }
})


module.exports = router;
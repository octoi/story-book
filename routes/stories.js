const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const { ensureAuth } = require('../middlewares/auth');

router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

module.exports = router;
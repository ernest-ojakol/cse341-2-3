const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.use('/temples', require('./temples'));
router.use('/churchstats', require('./churchstats'));
module.exports = router;
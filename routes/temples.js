const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const templeController = require('../controllers/temples');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.get('/', templeController.getAllTemples);
router.get(
    '/:id',
    [
        check('id').isMongoId().withMessage('Invalid temple ID format (must be a 24-character hex string)')
    ],
    validate,
    templeController.getSingleTemple
);

router.post(
    '/',
    [
        check('temple_name').notEmpty().withMessage('Temple name is required')
            .isString().withMessage('Temple name must be a string')
            .isLength({ min: 3 }).withMessage('Temple name must be at least 3 characters'),
        check('city').notEmpty().withMessage('City is required')
            .isString().withMessage('City must be a string'),
        check('date_of_announcement').isString().withMessage('Valid announcement date (YYYY-MM-DD) is required'),
        check('date_of_dedication').optional().isString().withMessage('Valid dedication date (YYYY-MM-DD) is required if provided'),
        check('size').optional().isString().withMessage('Size must be a provided')
    ],
    validate,
    templeController.announceTemple
);


router.put(
    '/:id',
    [
        check('id').isMongoId().withMessage('Invalid temple ID format (must be a 24-character hex string)'),
        check('temple_name').optional().isString().withMessage('Temple name must be a string')
            .isLength({ min: 3 }).withMessage('Temple name must be at least 3 characters'),
        check('city').optional().isString().withMessage('City must be a string'),
        check('date_of_announcement').optional().isString().withMessage('Valid announcement date (YYYY-MM-DD) is required if provided'),
        check('date_of_dedication').optional().isString().withMessage('Valid dedication date (YYYY-MM-DD) is required if provided'),
        check('size').optional().isString().withMessage('Size must be a provided')
    ],
    validate,
    templeController.renovateTemple
);

router.delete(
    '/:id',
    [
        check('id').isMongoId().withMessage('Invalid temple ID format (must be a 24-character hex string)')
    ],
    validate,
    templeController.deleteTemple
);

module.exports = router;
const router = require('express').Router();
const { body, param, validationResult } = require('express-validator');
const churchstatsController = require('../controllers/churchstats');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', async (req, res, next) => {
  try {
    await churchstatsController.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('ID must be a valid MongoDB ObjectId'),
    validate,
  ],
  async (req, res, next) => {
    try {
      await churchstatsController.getSingle(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  [
    body('country')
      .trim()
      .notEmpty()
      .withMessage('Country name is required'),
    body('stakes')
      .isInt({ min: 0 })
      .withMessage('Stakes must be a non-negative integer'),
    body('temples')
      .isInt({ min: 0 })
      .withMessage('Temples must be a non-negative integer'),
    body('church_members')
      .isInt({ min: 0 })
      .withMessage('Church members must be a non-negative integer'),
    body('temple_present')
      .isBoolean()
      .withMessage('Temple present must be a boolean'),
    body('temple_contributions')
      .isInt({ min: 0 })
      .withMessage('Temple contributions must be a non-negative integer'),
    body('names_submitted_to_temple')
      .isInt({ min: 0 })
      .withMessage('Names submitted to temple must be a non-negative integer'),
    validate,
  ],
  async (req, res, next) => {
    try {
      await churchstatsController.openNewCountry(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('ID must be a valid MongoDB ObjectId'),
    body('country')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Country name cannot be empty if provided'),
    body('stakes')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stakes must be a non-negative integer'),
    body('temples')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Temples must be a non-negative integer'),
    body('church_members')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Church members must be a non-negative integer'),
    body('temple_present')
      .optional()
      .isBoolean()
      .withMessage('Temple present must be a boolean'),
    body('temple_contributions')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Temple contributions must be a non-negative integer'),
    body('names_submitted_to_temple')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Names submitted to temple must be a non-negative integer'),
    validate,
  ],
  async (req, res, next) => {
    try {
      await churchstatsController.updateMembership(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('ID must be a valid MongoDB ObjectId'),
    validate,
  ],
  async (req, res, next) => {
    try {
      await churchstatsController.closeChurchOffice(req, res);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
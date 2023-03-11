const { Router } = require('express')
const authController = require('../controllers/authController')

const router = Router();

router.get('/studentReg', authController.studentReg_get);
router.post('/studentReg', authController.studentReg_post);

router.get('/stuLogin', authController.stuLogin_get);
router.post('/stuLogin', authController.stuLogin_post);

router.get('/teachLogin', authController.teachLogin_get);
router.post('/teachLogin', authController.teachLogin_post);

router.get('/teachReg', authController.teachReg_get);
router.post('/teachReg', authController.teachReg_post);



router.get('/logout', authController.logout_get);

module.exports = router;
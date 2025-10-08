const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userValidator = require('../validators/userValidator');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userValidator.createUser, userController.createUser);
router.put('/:id', userValidator.updateUser, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

const { Router } = require('express');
const usuarioController = require('../controllers/usuario.controller');

const express = require("express");

const router = express.Router();


router.post('/login', usuarioController.login);
router.get('/usuarios', usuarioController.listar);

module.exports = router;
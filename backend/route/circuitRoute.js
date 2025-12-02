const express = require('express')();
const Router = express.router;
const { getCircuit } = require('../controller/circuitController');

Router.get('/:id', getCircuit);

module.exports = Router;
const {Router} = require('express');

const {
    getAllDocentes
}=require('../controllers/docentes.controllers');

const router = Router();

//trae todos los docentes
router.post('/alldocentes', getAllDocentes);

module.exports = router;
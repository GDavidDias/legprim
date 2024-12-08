const {Router} = require('express');

const {
    getAllLegajosDocente
} = require('../controllers/legajos.controllers');

const router = Router();

//trae los legajos de un docente
router.post('/legajosdocente', getAllLegajosDocente);


module.exports = router;
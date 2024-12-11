const {Router} = require('express');

const {
    getAllFormacion,
    insertLegajoFormacion,
    getAllFormacionLegajo
} = require('../controllers/formacion.controllers');

const router = Router();

//Trae todos los cursos
router.post('/allformacion', getAllFormacion);

//inserta un registro en legajo formacion
router.post('/insertlegajoformacion', insertLegajoFormacion);

//Trae todas las Formaciones del Legajo informado por parametro
router.post('/allformacionlegajo/:idLegajo', getAllFormacionLegajo)



module.exports = router;
const {Router} = require('express');

const {
    getAllFormacion,
    insertLegajoFormacion,
    getAllFormacionLegajo,
    insertFormacion,
    updateFormacion,
    deleteFormacion,
    deleteLegajoFormacion
} = require('../controllers/formacion.controllers');

const router = Router();

//Trae todos los cursos
router.post('/allformacion', getAllFormacion);

//inserta un registro en legajo formacion
router.post('/insertlegajoformacion', insertLegajoFormacion);

//Trae todas las Formaciones del Legajo informado por parametro
router.post('/allformacionlegajo/:idLegajo', getAllFormacionLegajo)

//Inserta una nueva formacion
router.post('/insertformacion', insertFormacion);

//Actualiza formacion
router.put('/updateformacion/:idFormacion', updateFormacion);

//Borra una Formacion
router.put('/deleteformacion/:idFormacion', deleteFormacion);

//Borra Logicamente una Formacion de un legajo
router.put('/delformacionlegajo/:idLegajoFormacion', deleteLegajoFormacion);

module.exports = router;
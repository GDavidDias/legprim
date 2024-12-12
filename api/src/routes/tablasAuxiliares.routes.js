const {Router} = require('express');

const {
    getAllAlcance,
    getAllCategorias,
    getAllEvaluacion,
    getAllInstitucion,
    getAllModalidad
} = require('../controllers/tablasAuxiliares.controllers');

const router = Router();

//Traer trae tabla alcance
router.get('/allalcance', getAllAlcance);

//traer tabal categoria
router.get('/allcategoria', getAllCategorias);

//traer todo evaluacion
router.get('/allevaluacion', getAllEvaluacion);

//trae todas las intituciones
router.get('/allinstituciones', getAllInstitucion);

//trae todas las modalidades
router.get('/allmodalidad', getAllModalidad);


module.exports = router;
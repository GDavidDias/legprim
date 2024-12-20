const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //INSERTA NUEVA FORMACION

    const{cantidad_horas, descripcion, fecha_emision, id_alcance, id_categoria, id_evaluacion, id_institucion, id_modalidad, puntaje, resolucion, id_nivel, observacion, user_create, date_create} = req.body;

    console.log('que trae cantidad_horas: ', cantidad_horas);
    console.log('que trae descripcion: ', descripcion);
    console.log('que trae fecha_emision: ', fecha_emision);
    console.log('que trae id_alcance: ', id_alcance);
    console.log('que trae id_categoria: ', id_categoria);
    console.log('que trae id_evaluacion: ', id_evaluacion);
    console.log('que trae id_institucion: ', id_institucion);
    console.log('que trae id_modalidad: ', id_modalidad);
    console.log('que trae puntaje: ', puntaje);
    console.log('que trae resolucion: ', resolucion);
    console.log('que trae id_nivel: ', id_nivel);
    console.log('que trae observacion: ', observacion);
    console.log('que trae user_create: ', user_create);
    console.log('que trae date_create: ', date_create);

    try{

        let armaquery = `INSERT INTO formacion(cantidad_horas, descripcion, fecha_emision, id_alcance, id_categoria, id_evaluacion, id_institucion, id_modalidad, puntaje, resolucion, id_nivel, observacion, user_create, date_create) VALUES(
            '${cantidad_horas}', '${descripcion}', '${fecha_emision}', ${id_alcance}, ${id_categoria}, ${id_evaluacion}, ${id_institucion}, ${id_modalidad}, '${puntaje}', '${resolucion}', ${id_nivel}, '${observacion}', '${user_create}', '${date_create}');
        `;

        const [result] = await pool.query(armaquery);

        console.log('que trae result insertFormacion: ', result);

        res.status(200).json({
            message:"Se agrego Nueva Formacion",
            result:result
        });
        
    }catch(error){
        res.status(400).send(error.message);
    }

};
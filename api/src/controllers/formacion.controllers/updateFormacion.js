const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //MODIFICA UNA FORMACION
    const{idFormacion} = req.params;
    console.log('que ingresa por idFormacion: ', idFormacion);
    
    const{id_categoria, descripcion, cantidad_horas, fecha_emision, id_institucion, puntaje, resolucion, id_alcance, id_evaluacion, id_modalidad, id_nivel, observacion, user_update, date_update} = req.body;

    console.log('que trae id_categoria: ', id_categoria);
    console.log('que trae descripcion: ', descripcion);
    console.log('que trae cantidad_horas: ', cantidad_horas);
    console.log('que trae fecha_emision: ', fecha_emision);
    console.log('que trae id_institucion: ', id_institucion);
    console.log('que trae puntaje: ', puntaje);
    console.log('que trae resolucion: ', resolucion);
    console.log('que trae id_alcance: ', id_alcance);
    console.log('que trae id_evaluacion: ', id_evaluacion);
    console.log('que trae id_modalidad: ', id_modalidad);
    console.log('que trae id_nivel: ', id_nivel);
    console.log('que trae observacion: ', observacion);
    console.log('que trae user_update: ', user_update);
    console.log('que trae date_update: ', date_update);
    //console.log('que trae obs_desactiva: ', obs_desactiva);

    try{
        const [result] = await pool.query(`UPDATE formacion SET id_categoria=${id_categoria}, descripcion='${descripcion}', cantidad_horas='${cantidad_horas}', fecha_emision='${fecha_emision}', id_institucion=${id_institucion}, puntaje='${puntaje}', resolucion='${resolucion}', id_alcance=${id_alcance}, id_evaluacion=${id_evaluacion}, id_modalidad=${id_modalidad}, id_nivel=${id_nivel}, observacion = '${observacion}', user_update = '${user_update}', date_update = '${date_update}' WHERE id_formacion=${idFormacion}; `);

        console.log('que trae result updateFormacion: ', result);

        res.status(200).json({
            message:'Formacion Actualizada'
        });
        
    }catch(error){
        res.status(400).send(error.message);
    }

};
const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //ELIMINA UNA FORMACION LOGICAMENTE, AGREGA EN CAMPO OBS_DELETE UNA DESCRIPCION DE PORQUE SE ELIMINA
    const{idFormacion} = req.params;
    console.log('que ingresa por idFormacion: ', idFormacion);

    const{user_delete, date_delete, obs_delete} = req.body;

    console.log('que tiene user_delete: ', user_delete);
    console.log('que tiene date_delete: ', date_delete);
    console.log('que tiene obs_delete: ', obs_delete);

    try{

        const [result] = await pool.query(`UPDATE formacion SET user_delete='${user_delete}', date_delete='${date_delete}', obs_delete='${obs_delete}' 
        WHERE id_formacion=${idFormacion};  `);

        console.log('que trae result deleteFormacion: ', result);

        res.status(200).json({
            message: 'Formacion Eliminada'
        });

    }catch(error){
        res.status(400).send(error.message);
    }

}
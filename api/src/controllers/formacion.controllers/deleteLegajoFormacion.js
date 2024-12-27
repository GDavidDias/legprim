const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //ELIMINA UNA FORMACION LOGICAMENTE DEL LEGAJO
    const{idLegajoFormacion} = req.params;
    console.log('que ingresa por idLegajoFormacion: ', idLegajoFormacion);

    const{user_delete, date_delete, obs_delete} = req.body;

    console.log('que tiene user_delete: ', user_delete);
    console.log('que tiene date_delete: ', date_delete);
    console.log('que tiene obs_delete: ', obs_delete);

    try{

        const [result] = await pool.query(`UPDATE legajo_formacion SET user_delete='${user_delete}', date_delete='${date_delete}', obs_delete='${obs_delete}' 
        WHERE id_legajo_formacion=${idLegajoFormacion} ;  `);

        console.log('que trae result deleteLegajoFormacion: ', result);

        res.status(200).json({
            message: 'Formacion Desasociada del Legajo'
        });

    }catch(error){
        res.status(400).send(error.message);
    }

}
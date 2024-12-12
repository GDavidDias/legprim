const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE DATOS TABLA ALCANCE

    try{
        let armaquery = `SELECT e.id_evaluacion, e.descripcion
            FROM evaluacion AS e
        `;

        const [result] = await pool.query(armaquery);
            
        console.log('que trae result getAllEvaluacion: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};
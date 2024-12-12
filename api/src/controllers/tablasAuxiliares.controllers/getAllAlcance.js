const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE DATOS TABLA ALCANCE

    try{
        let armaquery = `SELECT a.id_alcance, a.descripcion
            FROM alcance AS a
        `;

        const [result] = await pool.query(armaquery);
            
        console.log('que trae result getAllAlcance: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};
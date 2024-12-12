const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE DATOS TABLA INSTITUCION

    try{
        let armaquery = `SELECT i.id_institucion, i.descripcion
            FROM institucion AS i
        `;

        const [result] = await pool.query(armaquery);
            
        console.log('que trae result getAllInstitucion: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};
const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE DATOS TABLA MODALIDAD

    try{
        let armaquery = `SELECT m.id_modalidad, m.descripcion
            FROM modalidad AS m
        `;

        const [result] = await pool.query(armaquery);
            
        console.log('que trae result getAllModalidad: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};
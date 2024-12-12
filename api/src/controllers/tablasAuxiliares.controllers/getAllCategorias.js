const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE DATOS TABLA ALCANCE

    try{
        let armaquery = `SELECT c.id_categoria, c.descripcion
            FROM categoria AS c
        `;

        const [result] = await pool.query(armaquery);
            
        console.log('que trae result getAllCategoria: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};
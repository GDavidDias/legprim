const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE DATOS TABLA ALCANCE

    try{
        let armaquery = `SELECT n.id_nivel, n.descripcion
            FROM nivel AS n
        `;

        const [result] = await pool.query(armaquery);
            
        console.log('que trae result getAllNivel: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};
const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //INSERTA EN LEGAJO FORMACION

    const{idLegajo, idFormacion, username, fechaInsert} = req.body;
    console.log('que trae idLegajo: ', idLegajo);
    console.log('que trae idFormacion: ', idFormacion);
    console.log('que trae username: ', username);
    console.log('que trae fechaInsert: ', fechaInsert);

    try{

        let armaquery = `INSERT INTO legajo_formacion(id_legajo, id_formacion, username, fecha_insert) VALUES(
            ${idLegajo}, ${idFormacion}, '${username}', '${fechaInsert}');
        `;

        const [result] = await pool.query(armaquery);

        console.log('que trae result insertLegajoFormacion: ', result);

        res.status(200).json({
            message:"Se agrega formacion a legajo correctamente",
            result:result
        });
        
    }catch(error){
        res.status(400).send(error.message);
    }

};
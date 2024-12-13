const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODOS LOS CURSO DE TABLA FORMACION
    const{idLegajo} = req.params;
    console.log('que trae idLegajo: ', idLegajo);

    const{filtroBusqueda} = req.body;
    console.log('que trae filtroBusqueda: ', filtroBusqueda);

    try{

        let armaquery = `SELECT lf.id_legajo_formacion, lf.id_legajo, lf.id_formacion, f.descripcion, f.resolucion AS resolucion, f.cantidad_horas AS horas
            FROM legajo_formacion AS lf
            LEFT JOIN formacion AS f ON lf.id_formacion = f.id_formacion
            WHERE  lf.id_legajo = ${idLegajo}
        `;

        if(filtroBusqueda && filtroBusqueda!=""){
            armaquery+=` AND (LOWER (f.descripcion) LIKE '%${filtroBusqueda.toLowerCase()}%'  )  `;
        }

        const [result] = await pool.query(armaquery);
            

        console.log('que trae result getAllFormacionLegajo: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};
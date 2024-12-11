const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODOS LOS CURSO DE TABLA FORMACION

    const{filtroBusqueda} = req.body;
    console.log('que trae filtroBusqueda: ', filtroBusqueda);

    try{

        let armaquery = `SELECT f.id_formacion, f.id_categoria, c.descripcion AS categoria, f.descripcion, f.cantidad_horas, f.fecha_emision, f.id_institucion, i.descripcion AS institucion, f.puntaje, f.resolucion, f.id_alcance, f.id_evaluacion, f.id_modalidad, m.descripcion AS modalidad
            FROM formacion AS f 
            LEFT JOIN categoria AS c ON f.id_categoria = c.id_categoria
            LEFT JOIN institucion AS i ON f.id_institucion = i.id_institucion
            LEFT JOIN alcance AS a ON f.id_alcance = a.id_alcance
            LEFT JOIN modalidad AS m ON f.id_modalidad = m.id_modalidad
            WHERE 1=1
        `;

        //Condicion para Buscar Vacante por ID
        if(filtroBusqueda && filtroBusqueda!=''){
            armaquery += ` AND (LOWER (f.descripcion) LIKE '%${filtroBusqueda.toLowerCase()}%'  ) `;
        }

        armaquery += ` ORDER BY f.descripcion DESC `

        const [result] = await pool.query(armaquery);

            

        console.log('que trae result getAllFormacion: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};
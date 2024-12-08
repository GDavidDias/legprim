const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODOS LOS DOCENTES DE LA TABLA docente
    console.log('ingresa a getAllLegajosDocente');
    const {id_docente} = req.body;

    // console.log('que trae id_listado_inscriptos: ', id_listado_inscriptos);
    // console.log('que trae limit: ', limit);
    // console.log('que trae page: ', page);
    // console.log('que trae filtroAsignacion: ', filtroAsignacion);
    // console.log('que trae filtroEspecialidad: ', filtroEspecialidad);
    console.log('que trae id_docente: ', id_docente);

    //const offset = (page-1)*limit;


    let armaquery=`SELECT l.id_legajo, l.nro_legajo, l.id_docente, l.id_especialidad, e.abreviatura, e.descripcion
            FROM legajo AS l
            LEFT JOIN especialidad AS e ON l.id_especialidad = e.id_especialidad
            WHERE l.id_docente = ${id_docente}
            `;


    try{
        const [result] = await pool.query(`${armaquery}`);

        console.log('que trae result getAllLegajosDocente: ', result);

        //const [totalRows]= await pool.query(`SELECT COUNT(*) AS count FROM (${armaquery}) AS inscriptos`)

        //const totalPages= Math.ceil(totalRows[0]?.count/limit);
        //const totalItems=totalRows[0]?.count;

        res.status(200).json({
            result:result

        });
        
    }catch(error){
        res.status(400).send(error.message);
    }

};
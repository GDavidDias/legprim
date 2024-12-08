const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODOS LOS DOCENTES DE LA TABLA docente
    console.log('ingresa a getAllDocentes');
    const {filtroBusqueda} = req.body;

    // console.log('que trae id_listado_inscriptos: ', id_listado_inscriptos);
    // console.log('que trae limit: ', limit);
    // console.log('que trae page: ', page);
    // console.log('que trae filtroAsignacion: ', filtroAsignacion);
    // console.log('que trae filtroEspecialidad: ', filtroEspecialidad);
    console.log('que trae filtroBusqueda: ', filtroBusqueda);

    //const offset = (page-1)*limit;


    let armaquery=`SELECT d.id_docente, d.dni, d.apellido, d.nombre
            FROM docente AS d
            WHERE 1=1 
            `;

    // if(filtroAsignacion==='asignados'){
    //     armaquery+=` AND at2.id_vacante_tit IS NOT NULL `;
    // }else if(filtroAsignacion==='sinasignar'){
    //     armaquery+=` AND at2.id_vacante_tit IS NULL `;
    // };

    // if(filtroEspecialidad && filtroEspecialidad!=''){
    //     armaquery+=` AND it.id_especialidad IN (${filtroEspecialidad}) `
    // }

    // if(filtroBusqueda && filtroBusqueda!=''){
    //     armaquery+=` AND (LOWER(it.apellido) LIKE '%${filtroBusqueda.toLowerCase()}%' 
    //                     OR LOWER(it.nombre) LIKE '%${filtroBusqueda.toLowerCase()}%'
    //                     OR LOWER(it.dni) LIKE '%${filtroBusqueda.toLowerCase()}%'
    //                     OR LOWER(e.descripcion) LIKE '%${filtroBusqueda.toLowerCase()}%'
    //                     )`
    // };

    if(filtroBusqueda && filtroBusqueda!=''){
        if(!isNaN(filtroBusqueda)){
            console.log('filtroBusqueda es NUMERO');
            armaquery+=` AND (LOWER(d.dni) LIKE '${filtroBusqueda}%' 
                        ) `

            armaquery+= ` ORDER BY d.dni ASC`
        }else{
            console.log('filtroBusqueda NO es Numero');
            armaquery+=` AND (LOWER(d.apellido) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                                OR LOWER(d.nombre) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                        ) `

            armaquery+= ` ORDER BY d.apellido ASC`
        }
    }else{
        console.log('Sin FiltroBusqueda');
        //armaquery+= ` ORDER BY d.apellido ASC`
    }

    //armaquery+=` ORDER BY d.apellido ASC `

    try{
        const [result] = await pool.query(`${armaquery}`);

        console.log('que trae result getAllDocentes: ', result);

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
const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODOS LOS CURSO DE TABLA FORMACION

    const{limit, page, filtroBusqueda, filtroBusquedaResolucion, filtroInstituto} = req.body;
    console.log('que trae limit: ', limit );
    console.log('que trae page: ', page);
    console.log('que trae filtroBusqueda: ', filtroBusqueda);
    console.log('que trae filtroBusquedaResolucion: ', filtroBusquedaResolucion);
    console.log('que trae filtroInstituto: ', filtroInstituto);

    try{

        const offset = (page-1)*limit;

        let armaquery = `SELECT f.id_formacion, f.id_categoria, c.descripcion AS categoria, f.descripcion, f.cantidad_horas, f.fecha_emision, f.id_institucion, i.descripcion AS institucion, f.puntaje, f.resolucion, f.id_alcance, f.id_evaluacion, f.id_modalidad, m.descripcion AS modalidad, f.id_nivel, n.descripcion AS nivel
            FROM formacion AS f 
            LEFT JOIN categoria AS c ON f.id_categoria = c.id_categoria
            LEFT JOIN institucion AS i ON f.id_institucion = i.id_institucion
            LEFT JOIN alcance AS a ON f.id_alcance = a.id_alcance
            LEFT JOIN modalidad AS m ON f.id_modalidad = m.id_modalidad
            LEFT JOIN nivel AS n ON f.id_nivel = n.id_nivel
            WHERE 1=1
        `;

        //Condicion para Buscar por nombre de curso
        if(filtroBusqueda && filtroBusqueda!=''){
            armaquery += ` AND (LOWER (f.descripcion) LIKE '%${filtroBusqueda.toLowerCase()}%'  ) `;
        }

        //Condicion para Buscar por resolucion
        if(filtroBusquedaResolucion && filtroBusquedaResolucion!=''){
            armaquery += ` AND (LOWER (f.resolucion) LIKE '%${filtroBusquedaResolucion.toLowerCase()}%'  ) `;
        }

        //Filtro de busqueda de Instituto
        if(filtroInstituto && filtroInstituto!=''){
            armaquery += ` AND (f.id_institucion IN (${filtroInstituto})  ) `;
        }

        armaquery += ` ORDER BY f.id_formacion DESC `

        const [result] = await pool.query(`${armaquery} LIMIT ${limit} OFFSET ${offset}`);

        console.log('que trae result getAllFormacion: ', result);

        const [totalRows]= await pool.query(`SELECT COUNT(*) AS count FROM (${armaquery}) AS inscriptos`)

        const totalPages= Math.ceil(totalRows[0]?.count/limit);

        const totalItems=totalRows[0]?.count;

        res.status(200).json({
            result:result,
            paginacion:{
                page:page,
                limit:limit,
                totalPages:totalPages,
                totalItems:totalItems
            }

        });
        
    }catch(error){
        res.status(400).send(error.message);
    }

};
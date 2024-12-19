import axios from 'axios';
import { URL } from '../../varGlobal';

export const fetchAllCE = async(limit, page, filtroBusqueda, filtroBusquedaResolucion, filtroInstituto) => {
    const dataBody = {
        "limit":limit,
        "page":page,
        "filtroBusqueda":filtroBusqueda,
        "filtroBusquedaResolucion":filtroBusquedaResolucion,
        "filtroInstituto":filtroInstituto
    }

    try{
        const{data} = await axios.post(`${URL}/api/allformacion`, dataBody);

        return data;
        
    }catch(error){
        console.log('error en fetchAllCE: ', error.message);
    }
}
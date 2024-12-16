import axios from 'axios';
import { URL } from '../../varGlobal';

export const fetchAllFormacionlegajo = async(idLegajo, filtroBusqueda, filtroResolucion, filtroInstituto) => {
    const dataBody = {
        "filtroBusqueda":filtroBusqueda,
        "filtroResolucion":filtroResolucion, 
        "filtroInstituto": filtroInstituto
    }

    try{
        const{data} = await axios.post(`${URL}/api/allformacionlegajo/${idLegajo}`, dataBody);

        return data;
        
    }catch(error){
        console.log('error en fetchAllFormacionlegajo: ', error.message);
    }
}
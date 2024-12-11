import axios from 'axios';
import { URL } from '../../varGlobal';

export const fetchAllDocentes = async(limit,page,filtroBusqueda) => {
    const dataBody = {
        "limit":limit,
        "page":page,
        "filtroBusqueda":filtroBusqueda
    }

    try{
        const{data} = await axios.post(`${URL}/api/alldocentes`, dataBody);

        return data;
        
    }catch(error){
        console.log('error en fetchAllDocentes: ', error.message);
    }
}
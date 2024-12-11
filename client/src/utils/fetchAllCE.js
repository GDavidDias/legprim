import axios from 'axios';
import { URL } from '../../varGlobal';

export const fetchAllCE = async(filtroBusqueda) => {
    const dataBody = {
        "filtroBusqueda":filtroBusqueda
    }

    try{
        const{data} = await axios.post(`${URL}/api/allformacion`, dataBody);

        return data;
        
    }catch(error){
        console.log('error en fetchAllCE: ', error.message);
    }
}
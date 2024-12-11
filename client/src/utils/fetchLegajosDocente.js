import axios from 'axios';
import { URL } from '../../varGlobal';

export const fetchLegajosDocente = async(id_docente) => {
    const dataBody = {
        "id_docente":id_docente
    }

    try{
        const{data} = await axios.post(`${URL}/api/legajosdocente`, dataBody);

        return data;
        
    }catch(error){
        console.log('error en fetchLegajosDocente: ', error.message);
    }
}
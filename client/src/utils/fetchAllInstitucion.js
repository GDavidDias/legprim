import axios from 'axios';
import { URL } from '../../varGlobal';

export const fetchAllInstituciones = async() => {

    try{
        const{data} = await axios.get(`${URL}/api/allinstituciones`);

        return data;
        
    }catch(error){
        console.log('error en fetchAllInstituciones: ', error.message);
    }
}
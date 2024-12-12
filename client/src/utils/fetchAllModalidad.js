import axios from 'axios';
import { URL } from '../../varGlobal';

export const fetchAllModalidad = async() => {

    try{
        const{data} = await axios.get(`${URL}/api/allmodalidad`);

        return data;
        
    }catch(error){
        console.log('error en fetchAllModalidad: ', error.message);
    }
}
import axios from 'axios';
import { URL } from '../../varGlobal';

export const fetchAllEvaluacion = async() => {

    try{
        const{data} = await axios.get(`${URL}/api/allevaluacion`);

        return data;
        
    }catch(error){
        console.log('error en fetchAllEvaluacion: ', error.message);
    }
}
import axios from 'axios';
import { URL } from '../../varGlobal';

export const fetchAllNivel = async() => {

    try{
        const{data} = await axios.get(`${URL}/api/allnivel`);

        return data;
        
    }catch(error){
        console.log('error en fetchAllNivel: ', error.message);
    }
}
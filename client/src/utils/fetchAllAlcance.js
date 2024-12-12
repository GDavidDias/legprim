import axios from 'axios';
import { URL } from '../../varGlobal';

export const fetchAllAlcance = async() => {

    try{
        const{data} = await axios.get(`${URL}/api/allalcance`);

        return data;
        
    }catch(error){
        console.log('error en fetchAllAlcance: ', error.message);
    }
}
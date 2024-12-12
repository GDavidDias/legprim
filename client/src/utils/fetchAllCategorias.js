import axios from 'axios';
import { URL } from '../../varGlobal';

export const fetchAllCategorias = async() => {

    try{
        const{data} = await axios.get(`${URL}/api/allcategoria`);

        return data;
        
    }catch(error){
        console.log('error en fetchAllCategorias: ', error.message);
    }
}
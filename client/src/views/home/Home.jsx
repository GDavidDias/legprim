import React, { useEffect, useState } from 'react'
import Sidebar from '../sidebar/Sidebar'
import Footer from '../footer/Footer'
import Docentes from '../../components/Docentes/Docentes';
import Formacion from '../../components/Formacion/Formacion';
import { useSelector } from 'react-redux';
import { setPage } from '../../redux/configSlice';

const Home = () => {

    const[content, setContent]=useState(null);
    const pageSG = useSelector((state)=>state.config.page);

    //const pageSG = 'Docentes';

    useEffect(()=>{
        console.log('que tiene pageSG: ', pageSG)
        switch(pageSG){
            case 'Docentes':
                setContent(<Docentes/>);
            break;
            case 'Formacion':
                setContent(<Formacion/>);
            break;
        }
    },[pageSG]);

    useEffect(()=>{
        //setPage('Docentes');
    },[])

  return (
    <div className='h-full w-full fixed'>
        {/* CONTENEDOR SUPERIOR */}
        <div className='w-full h-[95vh] flex flex-row'>
            {/* BARRA NAVEGACION LATERAL */}
            <div className='w-[15vw] h-[95vh]'>
                <Sidebar/>
            </div>
            {/* PAGINAS DE CONTENIDOS */}
            <div className='w-[85vw] h-[95vh]'>
                {content}
            </div>
        </div>

        {/* CONTENEDOR INFERIOR */}
        <div className='w-full h-[5vh]'>
            {/* PIE DE SITIO */}
            <Footer/>
        </div>
    </div>
  )
}

export default Home
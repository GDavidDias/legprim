import React, { useEffect, useState } from 'react'
import logo from '../../assets/JUNTA-04-xs.png';
import { PiUserListBold, PiListMagnifyingGlassBold  } from "react-icons/pi";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaRegUserCircle, FaPowerOff  } from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi2";
import { setPage } from '../../redux/configSlice';
import { outUser } from '../../redux/userSlice';

const Sidebar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userSG = useSelector((state)=>state.user);
  const pageSG = useSelector((state)=>state.config.page);

  const[open, setOpen]=useState(false);

  const submitDocentes = () =>{
    dispatch(setPage('Docentes'));
  };

  const submitFormacion = () =>{
    dispatch(setPage('Formacion'));
  };

  const submitSalir = () =>{
    navigate('/');
    dispatch(outUser());
  };

  useEffect(()=>{
    console.log('que tiene userSG: ', userSG);
    if(userSG.id_usuario===''){
      navigate('/');
    }
  },[userSG])

  return (
    <nav>
      <div className='notranslate flex flex-col bg-[#7C8EA6] h-[95vh] '>
        {/* LOGO Y TITULO APP */}
        <div className="h-[8vh] p-[4px] flex flex-row items-center mt-[4px] ml-[4px] " >
            <div className="flex h-[8vh] w-[30%]">
                <img src={logo} className="max-w-full max-h-full object-contain"/>
            </div>
            <div className="w-[70%] flex flex-col ml-[5px] text-white ">
                <p style={{lineHeight: '1'}} className="leading-none desktop:text-xs desktop-md:text-base desktop-lg:text-lg " >Legajos Primaria</p>
                {/* <label className="">Sistema </label>
                <label className="mt-[-8px]">Entrega de </label>
                <label className="mt-[-6px] font-semibold ">CARGOS</label> */}
            </div>
        </div>

        <div className='text-white italic ml-2 text-sm'>
          <label>Bienvenido! </label>
          <label>{userSG.nombre}</label>
        </div>

        {/* MENU PRINCIPAL */}
        <div className='ml-4 mt-2 text-white text-base'>
          {/* <label className='font-normal text-lg'>Docentes</label> */}
            <div 
                className={` rounded p-[4px] flex flex-row justify-start items-center  text-white 
                  ${(pageSG==='Docentes')
                    ?`bg-[#C9D991] text-[#7C8EA6]`
                    :`hover:bg-[#C9D991]`
                  }

                  `}
                onClick={()=>submitDocentes()}
            >
                <PiUserListBold className="text-xl font-bold mr-2"/>
                <label className="font-light desktop-xl:text-lg">Docentes</label>
            </div>
            <div 
                className={` rounded p-[4px] flex flex-row justify-start items-center  text-white 
                  ${(pageSG==='Formacion')
                    ?`bg-[#C9D991] text-[#7C8EA6]`
                    :`hover:bg-[#C9D991]`
                  }
                  
                  `}
                onClick={()=>submitFormacion()}
            >
                <HiAcademicCap className="text-xl font-bold mr-2"/>
                <label className="font-light desktop-xl:text-lg">Formacion</label>
            </div>
            <div 
              className={` rounded p-[4px] flex flex-row justify-start items-center  text-white hover:bg-[#C9D991] `}
              onClick={()=>submitSalir()}
            >
              <FaPowerOff className="text-lg  mr-2"/>
              <label className="font-light desktop-xl:text-lg">Salir</label>
            </div>
        </div>
      </div>
    </nav>
  )
}

export default Sidebar;
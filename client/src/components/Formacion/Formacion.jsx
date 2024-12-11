import React, { useEffect, useState } from 'react'
import { FaDotCircle, FaSearch, FaEye, FaTimes, FaEdit} from "react-icons/fa";
import { fetchAllCE } from '../../utils/fetchAllCE';

const Formacion = () => {
    //E.L. para cuadro de busqueda
    const[inputSearch, setInputSearch]=useState('');

    const[listadoCE, setListadoCE]=useState([]);

    const handleInputSearchChange = (event) =>{
        const {value} = event.target;
        setInputSearch(value);
        //setCurrentPage(1);
    };

    const handleCancelSearch =()=>{
        setInputSearch('');
    };

    const traeAllFormaciones = async(filtroBusquedaCE) =>{
        const dataCE = await fetchAllCE(filtroBusquedaCE);
        console.log('que tiene fetchAllCE: ', dataCE);
        if(dataCE?.length!=0){
            setListadoCE(dataCE);
        }else{
            setListadoCE([]);
        }
    };

    useEffect(()=>{
        traeAllFormaciones(inputSearch);
    },[inputSearch]);

    useEffect(()=>{
        traeAllFormaciones(inputSearch);
    },[])

  return (
    <div>
        <div>
            <label className='ml-2 font-bold'>Formacion</label>
        </div>
        {/* CONTENIDO DE PAGINA */}
        <div className='mb-2'>
            {/* PARTE SUPERIOR DE TABLA */}
            <div className="w-[50%] mb-2 flex justify-start ">
                <div className="w-[20vw] border-[1px] border-zinc-400  rounded flex flex-row items-center justify-between mx-2">
                    <input 
                        className="w-[15vw]  focus:outline-none rounded"
                        placeholder="Buscar curso..."
                        type="text"
                        value={inputSearch}
                        onChange={handleInputSearchChange}
                    />
                    <div className="flex flex-row items-center">
                        {(inputSearch!='') &&
                            <FaTimes
                                className="text-slate-400 cursor-pointer text-lg"
                                onClick={()=>handleCancelSearch()}
                            />
                        }
                    </div>
                </div>
            </div>

            {/* PARTE INFERIOR DE DATOS DE TABLA */}
            <div className='mx-2 h-[76vh] overflow-y-auto border-[1px] border-gray-400 rounded-md'>
                <table>
                    <thead className='border-[1px] bg-slate-200 w-full w-[100%] table-fixed'>
                        <tr className='sticky top-0 text-base border-b-[1px] border-zinc-600 bg-purple-200'>
                            <th className='w-[10mm]'>ID</th>
                            <th className='w-[120mm]'>Descripcion</th>
                            <th className='w-[50mm]'>Categoria</th>
                            <th className='w-[50mm]'>Horas</th>
                            <th className='w-[70mm]'>Institucion</th>
                            <th className='w-[90mm]'>Resolucion</th>
                            <th className='w-[50mm]'>Modalidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listadoCE?.map((formacion,index)=>{
                                const colorFila = (((index%2)===0) ?`bg-zinc-200` :``)
                                return(
                                    <tr
                                        className={`text-base font-medium border-b-[1px]  border-zinc-500 h-[5vh] ${colorFila} hover:bg-orange-300`}
                                        key={index}
                                    >
                                        <td className='w-[10mm] font-light text-grey-600'>{formacion.id_formacion}</td>
                                        <td className='w-[120mm] text-start'>{formacion.descripcion}</td>
                                        <td className='w-[50mm] text-center'>{formacion.categoria}</td>
                                        <td className='w-[50mm] text-center'>{formacion.cantidad_horas}</td>
                                        <td className='w-[70mm] text-center'>{formacion.institucion}</td>
                                        <td className='w-[90mm]'>{formacion.resolucion}</td>
                                        <td className='w-[50mm] text-center'>{formacion.modalidad}</td>
                                        <td>
                                            <div className='flex justify-center'>
                                                <FaEye 
                                                    className="font-bold text-lg mr-2 text-sky-500 hover:scale-150 transition-all duration-500 cursor-pointer"
                                                    title="Ver Datos"
                                                    onClick={()=>{submitVerDatosDocente(docente);setDatosDocenteSelect(docente)}}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>

  )
}

export default Formacion
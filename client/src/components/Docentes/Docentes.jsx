import React, { useEffect, useState } from 'react'
import { fetchAllDocentes } from '../../utils/fetchAllDocentes';
import { FaDotCircle, FaSearch, FaEye, FaTimes, FaEdit} from "react-icons/fa";
import {useModal} from '../../hooks/useModal';
import ModalEdit from "../ModalEdit/ModalEdit";
import { fetchLegajosDocente } from '../../utils/fetchLegajosDocente';
import { fetchAllCE } from '../../utils/fetchAllCE';
import { IoMdAdd } from "react-icons/io";
import axios from 'axios';
import { URL } from '../../../varGlobal';
import Modal from "../Modal/Modal";
import { fetchAllFormacionlegajo } from '../../utils/fetchAllFormacionLegajo';
import Paginador from "../Paginador/Paginador.jsx";
import { useSelector } from 'react-redux';


const Docentes = () => {

    const userSG = useSelector((state)=>state.user);

    const[isOpenModalSelectLegajo, openModalSelectLegajo, closeModalSelectLegajo]=useModal(false);
    const[isOpenModalLegajo, openModalLegajo, closeModalLegajo]=useModal(false);
    const[isOpenModal, openModal, closeModal]=useModal(false);

    //E.L. para Mensaje en Modal de Notificaciones
    const[mensajeModalInfo, setMensajeModalInfo]=useState('');
    
    const[listadoDocentes, setListadoDocentes]=useState([]);
    const[listadoLegajosDocente, setListadoLegajosDocente]=useState([]);
    const[listadoCE, setListadoCE]=useState([]);
    const[listadoCL, setListadoCL]=useState([]);

    //E.L. para cuadro de busqueda
    const[inputSearch, setInputSearch]=useState('');
    const[inputSearchCE, setInputSearchCE]=useState('');
    const[inputSearchCL, setInputSearchCL]=useState('');
    const[datosDocenteSelect, setDatosDocenteSelect]=useState('');
    const[datosLegajoSelect, setDatosLegajoSelect]=useState('');

    //E.L. para guardar datos de paginacion
    const[paginacion, setPaginacion]=useState('');

    //pagina actual
    const[currentPage, setCurrentPage]=useState(1);


    const fetchDocentes = async(page)=>{
        const limit=14;

        const data = await fetchAllDocentes(limit,page,inputSearch);
        if(data.result?.length!=0){
            console.log('que tiene data: ', data.result);
            setListadoDocentes(data.result);
            setPaginacion(data.paginacion);
        }else{
            setListadoDocentes([]);
            setPaginacion(data.paginacion);
        }
    };

    const handleInputSearchChange = (event) =>{
        const {value} = event.target;
        setInputSearch(value);
        setCurrentPage(1);
    };

    const handleCancelSearch =()=>{
        setInputSearch('');
    };

    const handleInputSearchChangeCE = (event) =>{
        const {value} = event.target;
        setInputSearchCE(value);
    };

    const handleCancelSearchCE =()=>{
        setInputSearchCE('');
    };

    const handleInputSearchChangeCL = (event) =>{
        const {value} = event.target;
        setInputSearchCL(value);
        
    };

    const handleCancelSearchCL =()=>{
        setInputSearchCL('');
    };

    const submitVerDatosDocente = async(datosDocente)=>{
        console.log('datos docente seleccionado: ', datosDocente);
        //busco legajos de docente seleccionado
        const data = await fetchLegajosDocente(datosDocente.id_docente);
        if(data.result?.length!=0){
            console.log('que tiene data: ', data.result);
            setListadoLegajosDocente(data.result);
        }else{
            setListadoLegajosDocente([])
        }
        
        openModalSelectLegajo(true);
    };

    const submitSelectLegajo = async(datosLegajo)=>{
        console.log('que datos tiene legajo: ', datosLegajo);
        setDatosLegajoSelect(datosLegajo);
        //Traer los cursos Existentes
        traeAllFormaciones(inputSearchCE)
        //Traer los cursos del Legajo
        //se actualiza Parte Derecha de CUrsos del legjo
        traeFormacionLegajo(datosLegajo.id_legajo);


        //llamar a modal para cargar los cursos
        openModalLegajo(true);
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

    const submitAddFormacion = async(datosFormacion) =>{
        console.log('que tiene submitAddFormacion: ', datosFormacion);
        console.log('que datos tiene legajo: ', datosLegajoSelect);

        const fechaHoraActualAddFormacion = await traeFechaHoraActual();

        //Con los datos del legajo cargados y con los de la formacion se realiza insert en tabla
        const dataBody = {
            "idLegajo":datosLegajoSelect.id_legajo,
            "idFormacion":datosFormacion.id_formacion,
            "username": userSG.username,
            "fechaInsert": fechaHoraActualAddFormacion
        }
    
        try{
            await axios.post(`${URL}/api/insertlegajoformacion`, dataBody)
                .then(async res=>{
                    console.log('que trae res de insertLegajoFormacion: ', res);
                    setMensajeModalInfo('Formacion asignada correctamente al Legajo')
                    openModal();
                })
                .catch(error=>{
                    console.log('que trae error insertLegajoFormacion: ', error);
                })
            
            
        }catch(error){
            console.log('error en addLegajoFormacion: ', error.message);
        }

    };

    const traeFechaHoraActual = () => {
        const now = new Date();
        
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11, por eso se suma 1
        const day = String(now.getDate()).padStart(2, '0');
    
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const closeModalNotifInsertFormacion=async()=>{
        //se actualiza Parte Derecha de CUrsos del legjo
        traeFormacionLegajo(datosLegajoSelect.id_legajo, inputSearchCL);

        //Se cierra Modal Notificaciones
        closeModal();
    };

    const traeFormacionLegajo = async(idLegajo, filtroBusqueda) =>{
        const data = await fetchAllFormacionlegajo(idLegajo, filtroBusqueda);

        if(data?.length!=0){
            //Trae datos
            console.log('que trae fetchAllFormacionLegajo: ', data);
            setListadoCL(data);
        }else{
            setListadoCL([]);
        }
    };

    const submitCloseModalLegajo = () =>{
        //cierro modal de Legajo-Formacion
        closeModalLegajo()
        //cierro Modal de Seleccion legajo
        closeModalSelectLegajo()
    };

    const handlePageChange = (nuevaPagina)=>{
        console.log('que tiene paginacion: ', paginacion);

        if(nuevaPagina>0 && nuevaPagina<=paginacion?.totalPages){
            setCurrentPage(nuevaPagina);
        };
    };

    useEffect(()=>{
        //Cl cargar en input CE
        traeAllFormaciones(inputSearchCE);
    },[inputSearchCE])
    
    useEffect(()=>{
        //Al cargar Input se actualiza 
        traeFormacionLegajo(datosLegajoSelect.id_legajo, inputSearchCL);
    },[inputSearchCL]);

    useEffect(()=>{
        console.log('que tiene inputSearch: ', inputSearch);
        fetchDocentes(currentPage);
    },[inputSearch,currentPage])

    useEffect(()=>{
        fetchDocentes(currentPage);
    },[])

  return (
    <div>
        <div>
            <label className='ml-2 font-bold'>Docentes</label>
        </div>
        {/* CONTENIDO DE PAGINA */}
        <div className=''>
            {/* PARTE SUPERIOR DE TABLA */}
            <div className='mb-2'>
                {/* Campo de Busqueda */}
                <div className="w-[50%]  flex justify-start ">
                    <div className="w-[20vw] border-[1px] border-zinc-400  rounded flex flex-row items-center justify-between mx-2">
                        <input 
                            className="w-[15vw]  focus:outline-none rounded"
                            placeholder="Buscar dni o apellido..."
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
                            {/* <FaSearch 
                                className="text-zinc-500 cursor-pointer mr-2"
                                onClick={()=>submitSearch()}
                            /> */}
                        </div>
                    </div>
                </div>
            </div>arbolito navidad
            {/* PARTE INFERIOR DE DATOS DE TABLA */}
            <div className='mx-2 h-[76vh] overflow-y-auto border-[1px] border-gray-400 rounded-md'>
                <table>
                    <thead className='border-[1px] bg-slate-200 w-full w-[100%] table-fixed'>
                        <tr className='sticky top-0 text-base border-b-[1px] border-zinc-600 bg-purple-200'>
                            <th className='w-[6mm]'>ID</th>
                            <th className='w-[30mm]'>Dni</th>
                            <th className='w-[50mm]'>Apellido</th>
                            <th className='w-[90mm]'>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listadoDocentes?.map((docente,index)=>{
                                const colorFila = (((docente.id_docente%2)===0) ?`bg-zinc-200` :``)
                                return(
                                    <tr
                                        className={`text-base font-medium border-b-[1px]  border-zinc-500 h-[5vh] ${colorFila}`}
                                        key={index}
                                    >
                                        <td className='w-[6mm] font-light text-grey-600'>{docente.id_docente}</td>
                                        <td className='w-[30mm] text-center'>{docente.dni}</td>
                                        <td className='w-[50mm]'>{docente.apellido}</td>
                                        <td className='w-[90mm]'>{docente.nombre}</td>
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
            {/* SECCION PAGINACION */}
            <div className="flex justify-center w-[50%] mt-2">
                <Paginador
                    currentpage={paginacion.page}
                    totalpage={paginacion.totalPages}
                    onPageChange={handlePageChange}
                    totalItems={paginacion.totalItems}
                />

            </div>

        </div>

        {/* MODAL SELECCION DE LEGAJO*/}
        <ModalEdit isOpen={isOpenModalSelectLegajo} closeModal={closeModalSelectLegajo}>
            <div className="mt-2 w-[40vw] flex flex-col items-center">
                {/* <h1 className="text-xl text-center font-bold">{mensajeModalConfirm}</h1> */}
                <h1 className="text-xl text-center font-bold mb-4">Seleccione Legajo</h1>
                <div className="flex flex-col justify-start">
                    <div className='border-[1px] border-purple-500 '>
                        <table>
                            <thead>
                                <tr className='sticky top-0 text-sm border-b-[2px] border-zinc-300 bg-zinc-200'>
                                    <th className='border-r-[1px] border-zinc-300'>ID</th>
                                    <th className='border-r-[1px] border-zinc-300'>Nro Legajo</th>
                                    <th className='border-r-[1px] border-zinc-300'>Id Docente</th>
                                    <th className='border-r-[1px] border-zinc-300'>Especialidad</th>
                                    <th className=''>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listadoLegajosDocente?.map((legajo,index)=>{

                                        return(
                                            <tr 
                                                className={`text-lg font-medium border-b-[1px] border-zinc-300 h-[5vh] hover:bg-orange-300`}
                                                key={index}
                                            >
                                                <td className='text-center'>{legajo.id_legajo}</td>
                                                <td className='text-center'>{legajo.nro_legajo}</td>
                                                <td className='text-center'>{legajo.id_docente}</td>
                                                <td className='text-center'>{legajo.abreviatura}</td>
                                                <td className=''>
                                                    <div className='flex justify-center'>
                                                        <FaEdit
                                                            className="font-bold text-lg mr-2 text-sky-500 hover:scale-150 transition-all duration-500 cursor-pointer"
                                                            title='Seleccionar'
                                                            onClick={()=>submitSelectLegajo(legajo)}
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
                <div className="flex flex-row">
                    {/* <div className="flex justify-center mr-2">
                        <button
                            className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                            //onClick={()=>verDatosLegajo()}
                        >ACEPTAR</button>
                    </div> */}
                    <div className="flex justify-center ml-2">
                        <button
                            className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                            onClick={()=>closeModalSelectLegajo()}
                        >CANCELAR</button>
                    </div>
                </div>    
            </div>
        </ModalEdit>

        {/* MODAL LEGAJO */}
        <ModalEdit isOpen={isOpenModalLegajo} closeModal={closeModalLegajo}>
        <div className="mt-2 w-[85vw] flex flex-col items-center">
                {/* <h1 className="text-xl text-center font-bold">{mensajeModalConfirm}</h1> */}
                <h1 className="text-xl text-center font-bold mb-2">Legajo Cursos</h1>
                {/* DATOS DEL DOCENTE */}
                <div className="mb-4 flex flex-row justify-end border-[1px] border-orange-500 p-2 rounded-md bg-orange-100">
                    <div className='mr-2 flex flex-col justify-end '>
                        <label className='font-semibold'>Especialidad: </label>
                        <input 
                            className='pl-2 border-[1px] border-gray-400 w-[40mm] font-bold text-sky-500' 
                            value={datosLegajoSelect.abreviatura}
                        />
                    </div>
                    <div className='mr-2 flex flex-col justify-end'>
                        <label className='font-semibold'>DNI: </label>
                        <input 
                            className='border-[1px] border-gray-400 w-[40mm]' 
                            value={datosDocenteSelect.dni}
                        />
                    </div>
                    <div className='mr-2 flex flex-col justify-end'>
                        <label className='font-semibold'>Apellido: </label>
                        <input 
                            className='border-[1px] border-gray-400 w-[60mm]'
                            value={datosDocenteSelect.apellido}
                        />
                    </div>
                    <div className='flex flex-col justify-end'>
                        <label className='font-semibold'>Nombre: </label>
                        <input 
                            className='border-[1px] border-gray-400 w-[60mm]'
                            value={datosDocenteSelect.nombre}
                        />
                    </div>
                    

                </div>

                {/* SECCION DE CURSOS */}
                <div className='border-[1px] border-sky-500 bg-violet-100 p-2 w-[85vw] h-[62vh] flex flex-row justify-between rounded-md'>
                    {/* PARTE IZQUIERDA DE LISTADO DE CURSOS */}
                    <div >
                        <label className='font-bold'>Cursos Existentes</label>
                        {/* BUSCARDOR CURSOS EXISTENTES */}
                        <div className="mb-2 w-[20vw] border-[1px] border-zinc-400  rounded flex flex-row items-center justify-between bg-white">
                            <input 
                                className="w-[15vw]  focus:outline-none rounded "
                                placeholder="Buscar nombre curso..."
                                type="text"
                                value={inputSearchCE}
                                onChange={handleInputSearchChangeCE}
                            />
                            <div className="flex flex-row items-center ">
                                {(inputSearchCE!='') &&
                                    <FaTimes
                                        className="text-slate-400 cursor-pointer text-lg"
                                        onClick={()=>handleCancelSearchCE()}
                                    />
                                }

                            </div>
                        </div>
                        <div className='border-[2px] border-blue-300 w-[50vw] h-[50vh] overflow-y-auto rounded-md'>
                            <table className="border-[1px] bg-slate-50 w-[150%] table-fixed">
                                <thead>
                                    <tr className="sticky top-0 text-sm border-b-[2px] border-zinc-300 bg-zinc-200 ">
                                        <th className="w-[2mm] border-r-[1px] border-zinc-300"></th>
                                        <th className="w-[25px] border-r-[1px] border-zinc-300">ID</th>
                                        <th className="w-[150px] border-r-[1px] border-zinc-300">Nombre Curso</th>
                                        <th className="w-[10mm] border-r-[1px] border-zinc-300">Horas</th>
                                        <th className="w-[20mm] border-r-[1px] border-zinc-300">Resolucion</th>
                                        <th className="w-[20mm] border-r-[1px] border-zinc-300">Instituto</th>
                                        <th className="w-[15mm] border-r-[1px] border-zinc-300">Modalidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listadoCE?.map((curso, index)=>{
                                            return(
                                                <tr
                                                    className={`text-lg font-medium border-b-[1px] border-zinc-300 h-[5vh] hover:bg-orange-300 `}
                                                    key={index}
                                                >
                                                    <td className='w-[2mm] text-center'>
                                                        <div>
                                                            <IoMdAdd
                                                                className="font-bold text-lg mr-2 text-sky-500 hover:scale-150 transition-all duration-500 cursor-pointer"
                                                                onClick={()=>submitAddFormacion(curso)}
                                                                title='Agregar Formacion a Legajo'
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className='w-[25px] text-sm  text-center'>{curso.id_formacion}</td>
                                                    <td className='w-[150px] text-sm text-start'>{curso.descripcion}</td>
                                                    <td className='w-[10mm] text-sm text-center'>{curso.cantidad_horas}</td>
                                                    <td className='w-[20mm] text-sm text-start'>{curso.resolucion}</td>
                                                    <td className='w-[20mm] text-sm text-center'>{curso.institucion}</td>
                                                    <td className='w-[15mm] text-sm text-center'>{curso.modalidad}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                    {/* PARTE DERECHA DE CURSOS DEL LEGAJO */}
                    <div>
                        <label className='font-bold'>Cursos del legajo</label>
                        {/* BUSCARDOR CURSOS DEL LEGAJO */}
                        <div className="mb-2 w-[20vw]  border-[1px] border-zinc-400  rounded flex flex-row items-center justify-between mx-2 bg-white">
                            <input 
                                className="w-[15vw]  focus:outline-none rounded"
                                placeholder="Buscar nombre curso..."
                                type="text"
                                value={inputSearchCL}
                                onChange={handleInputSearchChangeCL}
                            />
                            <div className="flex flex-row items-center">
                                {(inputSearchCL!='') &&
                                    <FaTimes
                                        className="text-slate-400 cursor-pointer text-lg"
                                        onClick={()=>handleCancelSearchCL()}
                                    />
                                }
                            </div>
                        </div>
                        {/* LISTADO DE CURSOS */}
                        <div className='border-[2px] border-blue-500 w-[30vw] h-[50vh] overflow-y-auto rounded-md'>
                            <table className="border-[1px] bg-slate-50 w-[100%] table-fixed">
                                <thead>
                                    <tr className="sticky top-0 text-sm border-b-[2px] border-zinc-300 bg-zinc-200">
                                        {/* <th className="w-[25px] border-r-[1px] border-zinc-300"></th> */}
                                        <th className="w-[4mm] border-r-[1px] border-zinc-300">ID</th>
                                        <th className="w-[150px] border-r-[1px] border-zinc-300">Nombre Curso</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listadoCL?.map((curso, index)=>{
                                            return(
                                                <tr
                                                    className={`text-lg font-medium border-b-[1px] border-zinc-300 h-[5vh] hover:bg-orange-300 `}
                                                    key={index}
                                                >
                                                    {/* <td className='w-[25px] text-center'>
                                                        <div>
                                                            <IoMdAdd
                                                                className="font-bold text-lg mr-2 text-sky-500 hover:scale-150 transition-all duration-500 cursor-pointer"
                                                                onClick={()=>submitAddFormacion(curso)}
                                                            />
                                                        </div>
                                                    </td> */}
                                                    <td className='w-[4mm] text-sm text-center'>{curso.id_formacion}</td>
                                                    <td className='w-[150px] text-sm text-start'>{curso.descripcion}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

                {/* BOTONES */}
                <div className="flex flex-row">
                    {/* <div className="flex justify-center mr-2">
                        <button
                            className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                            //onClick={()=>verDatosLegajo()}
                        >ACEPTAR</button>
                    </div> */}
                    <div className="flex justify-center ml-2">
                        <button
                            className="border-2 border-[#557CF2] mt-4 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                            onClick={()=>submitCloseModalLegajo()}
                        >CERRAR</button>
                    </div>
                </div>    
            </div>
        </ModalEdit>

        {/* MODAL DE NOTIFICACIONES */}
        <Modal isOpen={isOpenModal} closeModal={closeModal}>
                <div className="mt-10 w-72">
                    <h1 className="text-xl text-center font-bold">{mensajeModalInfo}</h1>
                    <div className="flex justify-center">
                        <button
                            className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                            onClick={()=>closeModalNotifInsertFormacion()}
                        >OK</button>
                    </div>
                </div>
            </Modal>
    </div>
  )
}

export default Docentes;
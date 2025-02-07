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
import { fetchAllInstituciones } from '../../utils/fetchAllInstitucion.js';
import { IoTrash } from 'react-icons/io5';


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
    const[inputSearchResCE, setInputSearchResCE]=useState('');
    const[inputSearchResCL, setInputSearchResCL]=useState('');
    const[inputSearchCL, setInputSearchCL]=useState('');
    const[datosDocenteSelect, setDatosDocenteSelect]=useState('');
    const[datosLegajoSelect, setDatosLegajoSelect]=useState('');

    //estado guarda instituto seleccionado de los Cursos Existentes
    const[institutoFormacion, setInstitutoFormacion]=useState('');
    //estado guarda instituto seleccionado en Cursos del Legajo
    const[institutoFormacionCL, setInstitutoFormacionCL]=useState('');

    const[listadoInstituciones, setListadoInstitucion]=useState([]);

    //E.L. para guardar datos de paginacion
    const[paginacion, setPaginacion]=useState('');

    //pagina actual
    const[currentPage, setCurrentPage]=useState(1);

    //E.L. para guardar datos de paginacion DE CE
    const[paginacionCE, setPaginacionCE]=useState('');

    //pagina actual DE CE
    const[currentPageCE, setCurrentPageCE]=useState(1);

    //observaciones para eliminar el curso del legajo
    const[obsDelete, setObsDelete]=useState('');


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
        setCurrentPageCE(1);
    };

    const handleCancelSearchCE =()=>{
        setInputSearchCE('');
    };

    const handleInputSearchResChangeCE = (event) =>{
        const {value} = event.target;
        setInputSearchResCE(value);
        setCurrentPageCE(1);
    };

    const handleCancelSearchResCE =()=>{
        setInputSearchResCE('');
    };

    const handleInputSearchChangeCL = (event) =>{
        const {value} = event.target;
        setInputSearchCL(value);
        
    };

    const handleCancelSearchCL =()=>{
        setInputSearchCL('');
    };

    const handleInputSearchChangeResCL = (event) =>{
        const {value} = event.target;
        setInputSearchResCL(value);
        
    };

    const handleCancelSearchResCL =()=>{
        setInputSearchResCL('');
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
        traeAllFormaciones(currentPageCE, inputSearchCE)
        //Traer los cursos del Legajo
        //se actualiza Parte Derecha de CUrsos del legjo
        traeFormacionLegajo(datosLegajo.id_legajo);


        //llamar a modal para cargar los cursos
        openModalLegajo(true);
    };

    const traeAllFormaciones = async(page, filtroBusquedaCE, filtroBusquedaResCe, filtroInstituto) =>{
        const limit=10;
        const dataCE = await fetchAllCE(limit, page, filtroBusquedaCE, filtroBusquedaResCe, filtroInstituto);
        console.log('que tiene fetchAllCE: ', dataCE?.result);
        if(dataCE?.result.length!=0){
            setListadoCE(dataCE.result);
            setPaginacionCE(dataCE.paginacion);
        }else{
            setListadoCE([]);
            setPaginacionCE(dataCE.paginacion);
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
            "fechaInsert": fechaHoraActualAddFormacion,
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

    const submitDelFormacion = async(datos) =>{
      console.log('Presiona Eliminar Formacion de Legajo que tiene datos: ', datos);
      console.log('datos de usuario: ', userSG);

      const fechaHoraActualDelFormacionLegajo = await traeFechaHoraActual();

      const dataBody = {
        "user_delete": userSG.username,
        "date_delete": fechaHoraActualDelFormacionLegajo,
        "obs_delete": 'Se desasocia el Curso del Legajo'
        }
        console.log('que tiene idLegajoFormacion: ', datos.id_legajo_formacion);
        console.log('que tiene body a pasar a delformacionlegajo: ', dataBody);

    try{
        await axios.put(`${URL}/api/delformacionlegajo/${datos.id_legajo_formacion}`, dataBody)
        .then(async res=>{
            setMensajeModalInfo('Formacion Eliminada del Legajo');
            openModal();
        })
        .catch(error=>{
            console.log('que tiene error deleteLegajoFormacion: ', error);
        })
    }catch(error){
        console.log('que traer error eliminar legajo formacion: ', error.message);
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
        traeFormacionLegajo(datosLegajoSelect.id_legajo, inputSearchCL, inputSearchResCL);

        //Se cierra Modal Notificaciones
        closeModal();
    };


    const traeFormacionLegajo = async(idLegajo, filtroBusqueda, filtroResolucion, filtroInstituto) =>{
        const data = await fetchAllFormacionlegajo(idLegajo, filtroBusqueda, filtroResolucion, filtroInstituto);

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

    const handleChangeInstitutoFormacion =(event)=>{
        const{name, value} = event.target;
        console.log('que tiene name: ',name);
        console.log('que tiene value: ',value);
        setInstitutoFormacion(value);
        setCurrentPageCE(1);
    };

    const handleCancelInstitutoFormacion = () => {
        setInstitutoFormacion('');
    };  

    const handleChangeInstitutoFormacionCL =(event)=>{
        const{name, value} = event.target;
        console.log('que tiene name: ',name);
        console.log('que tiene value: ',value);
        setInstitutoFormacionCL(value);
        setCurrentPageCE(1);
    };

    const handleCancelInstitutoFormacionCL = () => {
        setInstitutoFormacionCL('');
    };  

    //SE CARGAN LOS LISTADOS DE TABLAS AUXILIARES
    const traeTablasAuxiliares = async() => {
        // const rescat = await fetchAllCategorias();
        // if(rescat.length!=0){
        //     console.log('que trae listado categorias: ', rescat);
        //     setListadoCategorias(rescat);
        // }else{setListadoCategorias([])}

        const resinst = await fetchAllInstituciones();
        if(resinst.length!=0){
            console.log('que trae listado instituciones: ', resinst);
            setListadoInstitucion(resinst);
        }else{setListadoInstitucion([])}

    };

    const handlePageChangeCE = (nuevaPagina)=>{
        console.log('que tiene paginacion: ', paginacionCE);

        if(nuevaPagina>0 && nuevaPagina<=paginacionCE?.totalPages){
            setCurrentPageCE(nuevaPagina);
        };
    };    

    useEffect(()=>{
        //Cl cargar en input CE
        traeAllFormaciones(currentPageCE, inputSearchCE, inputSearchResCE, institutoFormacion);
    },[currentPageCE, inputSearchCE, inputSearchResCE, institutoFormacion])
    
    useEffect(()=>{
        //Al cargar Input se actualiza 
        traeFormacionLegajo(datosLegajoSelect.id_legajo, inputSearchCL, inputSearchResCL, institutoFormacionCL);
    },[inputSearchCL, inputSearchResCL, institutoFormacionCL]);

    //UseEffect de docentes
    useEffect(()=>{
        console.log('que tiene inputSearch: ', inputSearch);
        fetchDocentes(currentPage);
    },[inputSearch,currentPage])

    useEffect(()=>{
        fetchDocentes(currentPage);
        traeTablasAuxiliares();
    },[])

  return (
    <div>
        <div>
            <label className='ml-2 text-lg font-bold'>Docentes</label>
        </div>
        {/* CONTENIDO DE PAGINA */}
        <div className=''>
            {/* PARTE SUPERIOR DE TABLA */}
            <div className='mb-2'>
                {/* Campo de Busqueda */}
                <div className="w-[50%]  flex justify-start ">
                    <div className={` w-[20vw] border-[1px] border-zinc-400  rounded flex flex-row items-center justify-between mx-2`}>
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
            </div>
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
                                const colorFila = (((index%2)===0) ?`bg-zinc-200` :``)
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

        {/* MODAL LEGAJO CURSOS*/}
        <ModalEdit isOpen={isOpenModalLegajo} closeModal={closeModalLegajo}>
        <div className="w-[85vw] flex flex-col items-center">
                {/* <h1 className="text-xl text-center font-bold">{mensajeModalConfirm}</h1> */}
                <h1 className="text-xl text-center font-bold mb-2">Legajo Cursos</h1>
                {/* DATOS DEL DOCENTE */}
                <div className="mb-4 flex flex-row justify-end border-[1px] border-orange-500 px-2 py-[4px] rounded-md bg-orange-100">
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
                <div className='border-[1px] border-sky-500 bg-violet-100 p-2 w-[85vw] max-h-[95vh] flex flex-row justify-between rounded-md'>
                    {/* PARTE IZQUIERDA DE LISTADO DE CURSOS EXISTENTES*/}
                    <div >
                        <label className='font-bold'>Cursos Existentes</label>
                        {/* BUSCADORES Y FILTROS */}
                        <div className='flex flex-row items-center justify-start flex-wrap'>
                            {/* BUSCARDOR CURSOS POR NOMBRE */}
                            <div className="mb-2 mr-2 w-[70mm] border-[1px] border-zinc-400  rounded flex flex-row items-center justify-between bg-white">
                                <input 
                                    className="w-[65mm]  focus:outline-none rounded "
                                    placeholder="Buscar nombre curso..."
                                    type="text"
                                    value={inputSearchCE}
                                    onChange={handleInputSearchChangeCE}
                                />
                                <div className="flex flex-row items-center ">
                                    {(inputSearchCE!='') &&
                                        <FaTimes
                                            className="text-slate-400 cursor-pointer text-lg w-[5mm]"
                                            onClick={()=>handleCancelSearchCE()}
                                        />
                                    }

                                </div>
                            </div>
                            {/* BUSCARDOR CURSOS POR RESOLUCION */}
                            <div className="mb-2 w-[40mm] border-[1px] border-zinc-400  rounded flex flex-row items-center justify-between bg-white">
                                <input 
                                    className="w-[35mm]  focus:outline-none rounded "
                                    placeholder="Buscar Resolucion..."
                                    type="text"
                                    value={inputSearchResCE}
                                    onChange={handleInputSearchResChangeCE}
                                />
                                <div className="flex flex-row items-center ">
                                    {(inputSearchResCE!='') &&
                                        <FaTimes
                                            className="text-slate-400 cursor-pointer text-lg w-[5mm]"
                                            onClick={()=>handleCancelSearchResCE()}
                                        />
                                    }

                                </div>
                            </div>
                            {/* FILTRO BUSQUEDA INSTITUCION */}
                            <div className='mb-2 w-[60mm] my-[2px] mx-2 p-[1px] flex flex-row items-center  border-zinc-400 border-[1px] rounded-md bg-white'>
                                {/* <label className='mr-2'>Institucion: </label> */}
                                <select 
                                    className={` focus:outline-none
                                        ${(institutoFormacion!='')
                                            ?`w-[60mm]`
                                            :`w-[55mm]`
                                        }
                                        `}
                                    name='id_institucion'
                                    value={institutoFormacion}
                                    onChange={handleChangeInstitutoFormacion}
                                >
                                    <option value='' selected disabled>Seleccione Institucion...</option>
                                    {
                                        listadoInstituciones?.map((inst, index)=>(
                                            <option
                                                key={index}
                                                value={inst.id_institucion}
                                                className='text-base '
                                            >{inst.descripcion}</option>
                                        ))
                                    }
                                </select>
                                <div className=' '>
                                    {(institutoFormacion!='') &&
                                        <FaTimes
                                            className="text-slate-400 cursor-pointer text-lg w-[5mm]"
                                            onClick={()=>handleCancelInstitutoFormacion()}
                                        />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='border-[2px] border-blue-300 w-[50vw] h-[50vh] overflow-y-auto rounded-md'>
                            <table className="border-[1px] bg-slate-50 desktop-xl:w-[100%] desktop-md:w-[150%] table-fixed">
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
                                                            {(userSG.permiso===1 || userSG.permiso===4) &&
                                                                <IoMdAdd
                                                                    className="font-bold text-lg mr-2 text-sky-500 hover:scale-150 transition-all duration-500 cursor-pointer"
                                                                    onClick={()=>submitAddFormacion(curso)}
                                                                    title='Agregar Formacion a Legajo'
                                                                />
                                                            }
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
                        {/* SECCION PAGINACION */}
                        <div className="flex justify-center w-[50%] mt-2">
                            <Paginador
                                currentpage={paginacionCE.page}
                                totalpage={paginacionCE.totalPages}
                                onPageChange={handlePageChangeCE}
                                totalItems={paginacionCE.totalItems}
                            />
                        </div>

                    </div>

                    {/* PARTE DERECHA DE CURSOS DEL LEGAJO */}
                    <div className=''>
                        <label className='font-bold'>Cursos del legajo</label>
                        <div className='flex flex-row items-center justify-start flex-wrap'>
                            {/* BUSCARDOR CURSOS DEL LEGAJO */}
                            <div className="mb-2 w-[40mm]  border-[1px] border-zinc-400  rounded flex flex-row items-center justify-between mr-2 bg-white">
                                <input 
                                    className="w-[35mm]  focus:outline-none rounded"
                                    placeholder="Buscar nombre curso..."
                                    type="text"
                                    onChange={handleInputSearchChangeCL}
                                    value={inputSearchCL}
                                />
                                <div className="flex flex-row items-center">
                                    {(inputSearchCL!='') &&
                                        <FaTimes
                                            className="text-slate-400 cursor-pointer text-lg w-[5mm]"
                                            onClick={()=>handleCancelSearchCL()}
                                        />
                                    }
                                </div>
                            </div>
                            {/* BUSCARDOR CURSOS POR RESOLUCION */}
                            <div className="mb-2 w-[30mm] border-[1px] border-zinc-400  rounded flex flex-row items-center justify-between bg-white">
                                <input 
                                    className="w-[25mm]  focus:outline-none rounded "
                                    placeholder="Buscar Resolucion..."
                                    type="text"
                                    value={inputSearchResCL}
                                    onChange={handleInputSearchChangeResCL}
                                />
                                <div className="flex flex-row items-center ">
                                    {(inputSearchResCL!='') &&
                                        <FaTimes
                                            className="text-slate-400 cursor-pointer text-lg w-[5mm]"
                                            onClick={()=>handleCancelSearchResCL()}
                                        />
                                    }

                                </div>
                            </div>
                            {/* FILTRO BUSQUEDA INSTITUCION */}
                            <div className='mb-2 w-[40mm] my-[2px] mx-2 p-[1px] flex flex-row items-center  border-zinc-400 border-[1px] rounded-md bg-white'>
                                {/* <label className='mr-2'>Institucion: </label> */}
                                <select 
                                    className={` focus:outline-none
                                        ${(institutoFormacionCL!='')
                                            ?`w-[34mm]`
                                            :`w-[38mm]`
                                        }
                                        `}
                                    name='id_institucion'
                                    value={institutoFormacionCL}
                                    onChange={handleChangeInstitutoFormacionCL}
                                >
                                    <option value='' selected disabled>Seleccione Institucion...</option>
                                    {
                                        listadoInstituciones?.map((inst, index)=>(
                                            <option
                                                key={index}
                                                value={inst.id_institucion}
                                                className='text-base '
                                            >{inst.descripcion}</option>
                                        ))
                                    }
                                </select>
                                <div className=' '>
                                    {(institutoFormacionCL!='') &&
                                        <FaTimes
                                            className="text-slate-400 cursor-pointer text-lg w-[5mm]"
                                            onClick={()=>handleCancelInstitutoFormacionCL()}
                                        />
                                    }
                                </div>
                            </div>

                        </div>

                        {/* LISTADO DE CURSOS */}
                        <div className='border-[2px] border-blue-500 w-[30vw] h-[50vh] overflow-y-auto overflow-x-auto rounded-md'>
                            <table className="border-[1px] bg-slate-50 desktop-xl:w-[100%] desktop-md:w-[150%] table-fixed">
                                <thead>
                                    <tr className="sticky top-0 text-sm border-b-[2px] border-zinc-300 bg-zinc-200">
                                        {/* <th className="w-[25px] border-r-[1px] border-zinc-300"></th> */}
                                        <th className="w-[4mm] border-r-[1px] border-zinc-300">ID</th>
                                        <th className="w-[50px] border-r-[1px] border-zinc-300">Resolucion</th>
                                        <th className="w-[150px] border-r-[1px] border-zinc-300">Nombre Curso</th>
                                        <th className="w-[50px] border-r-[1px] border-zinc-300">Horas</th>
                                        <th className="w-[50px] border-r-[1px] border-zinc-300 ">Action</th>
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
                                                    <td className='w-[50px] text-sm text-start'>{curso.resolucion}</td>
                                                    <td className='w-[150px] text-sm text-start'>{curso.descripcion}</td>
                                                    <td className='w-[50px] text-sm text-start'>{curso.horas}</td>
                                                    <td className='w-[50px] text-sm text-start'>{
                                                        <div className='flex justify-center'>
                                                            {(userSG.permiso === 1 || userSG.permiso === 4) &&
                                                                <IoTrash 
                                                                    className="font-bold text-xl text-red-500 hover:scale-150 transition-all duration-500 cursor-pointer"
                                                                    title="Eliminar Formacion"
                                                                    onClick={()=>submitDelFormacion(curso)}
                                                                />
                                                            }
                                                        </div>
                                                    }</td>
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
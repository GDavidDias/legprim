import React, { useEffect, useState } from 'react'
import { FaDotCircle, FaSearch, FaEye, FaTimes, FaEdit} from "react-icons/fa";
import { fetchAllCE } from '../../utils/fetchAllCE';
import { useSelector } from 'react-redux';
import ModalEdit from '../ModalEdit/ModalEdit';
import Modal from "../Modal/Modal";
import { useModal } from '../../hooks/useModal';
import { fetchAllCategorias } from '../../utils/fetchAllCategorias';
import { fetchAllInstituciones } from '../../utils/fetchAllInstitucion';
import { fetchAllAlcance } from '../../utils/fetchAllAlcance';
import { fetchAllEvaluacion } from '../../utils/fetchAllEvaluacion';
import { fetchAllModalidad } from '../../utils/fetchAllModalidad';
import axios from "axios";
import {URL} from '../../../varGlobal';
import { fetchAllNivel } from '../../utils/fetchAllNivel';

const Formacion = () => {

    const userSG = useSelector((state)=>state.user);

    const[isOpenModal, openModal, closeModal]=useModal(false);
    const[isOpenModalNuevaFormacion, openModalNuevaFormacion, closeModalNuevaFormacion]=useModal(false);
    const[isOpenModalVistaFormacion, openModalVistaFormacion, closeModalVistaFormacion]=useModal(false);

    //E.L. para cuadro de busqueda Nombre Curso
    const[inputSearch, setInputSearch]=useState('');
    //E.L. para cuadro de busqueda Resolucion
    const[inputSearchRes, setInputSearchRes]=useState('');

    const[listadoCE, setListadoCE]=useState([]);

    //E.: para tablas auxiliares
    const[listadoCategorias, setListadoCategorias]=useState([]);
    const[listadoInstituciones, setListadoInstitucion]=useState([]);
    const[listadoAlcance, setListadoAlcance]=useState([]);
    const[listadoEvaluacion, setListadoEvaluacion]=useState([]);
    const[listadoModalidad, setListadoModalidad]=useState([]);
    const[listadoNivel, setListadoNivel]=useState([]);

    //E.L de formulario Formacion
    const[formFormacion, setFormFormacion]=useState({
        id_categoria:'',
        descripcion:'',
        cantidad_horas:'',
        fecha_emision:'',
        id_institucion:'',
        puntaje:'',
        resolucion:'',
        id_alcance:'',
        id_evaluacion:'',
        id_modalidad:'',
        id_nivel:''
    });

    //E.L. para validar si va a permitir guardar nueva vacante.
    const[validaFormFormacion, setValidaFormFormacion]=useState(false);
    const[modificaVistaFormacion, setModificaVistaFormacion]=useState(false);

    //E.L. para Mensaje en Modal de Notificaciones
    const[mensajeModalInfo, setMensajeModalInfo]=useState('');

    const[editIdFormacion, setEditIdFormacion]=useState('');

    const[institutoFormacion, setInstitutoFormacion]=useState('');


    const handleChangeValue = (event) => {
        const{name, value} = event.target;
        console.log('que tiene name: ', name);
        console.log('que tiene value: ', value);
        setFormFormacion({
            ...formFormacion,
            [name]:value
        });
        setModificaVistaFormacion(true)
    };

    const handleInputSearchChange = (event) =>{
        const {value} = event.target;
        setInputSearch(value);
        //setCurrentPage(1);
    };

    const handleCancelSearch =()=>{
        setInputSearch('');
    };

    const handleInputSearchChangeRes = (event) =>{
        const {value} = event.target;
        setInputSearchRes(value);
        //setCurrentPage(1);
    };

    const handleCancelSearchRes =()=>{
        setInputSearchRes('');
    };



    const traeAllFormaciones = async(filtroBusquedaCE, filtroBusquedaResolucion, filtroInstituto) =>{
        const dataCE = await fetchAllCE(filtroBusquedaCE, filtroBusquedaResolucion, filtroInstituto);
        console.log('que tiene fetchAllCE: ', dataCE);
        if(dataCE?.length!=0){
            setListadoCE(dataCE);
        }else{
            setListadoCE([]);
        }
    };

    const submitNuevaFormacion = () =>{
        console.log('nueva Formacion');
        openModalNuevaFormacion();
    };

    //SE CARGAN LOS LISTADOS DE TABLAS AUXILIARES
    const traeTablasAuxiliares = async() => {
        const rescat = await fetchAllCategorias();
        if(rescat.length!=0){
            console.log('que trae listado categorias: ', rescat);
            setListadoCategorias(rescat);
        }else{setListadoCategorias([])}

        const resinst = await fetchAllInstituciones();
        if(resinst.length!=0){
            console.log('que trae listado instituciones: ', resinst);
            setListadoInstitucion(resinst);
        }else{setListadoInstitucion([])}

        const resalc = await fetchAllAlcance();
        if(resalc.length!=0){
            console.log('que trae listado alcance: ', resalc);
            setListadoAlcance(resalc);
        }else{setListadoAlcance([])}

        const reseval = await fetchAllEvaluacion();
        if(reseval.length!=0){
            console.log('que trae listado evaluaciones: ', reseval);
            setListadoEvaluacion(reseval);
        }else{setListadoEvaluacion([])}

        const resmod = await fetchAllModalidad();
        if(resmod.length!=0){
            console.log('que trae listado modalidad: ', resmod);
            setListadoModalidad(resmod);
        }else{setListadoModalidad([])}

        const resniv = await fetchAllNivel();
        if(resniv.length!=0){
            console.log('que trae listado nivel: ', resniv);
            setListadoNivel(resniv);
        }else{setListadoNivel([])}
    };


    const submitGuardarFormacion = async() =>{
        console.log('se presiona boton Guardar Nueva Foramcion');
        try{    
            await axios.post(`${URL}/api/insertformacion`,formFormacion)
                .then(async res=>{
                    setMensajeModalInfo('Formacion Creada Correctamente');
                    openModal();
                })
                .catch(error=>{
                    console.log('que tiene error insertFormacion: ', error);
                })

        }catch(error){
            console.log('que traer error guardar nueva formacion: ', error.message);
        }
    };


    const submitCloseModalNotificacion = ()=>{
        closeModal();
        closeModalNuevaFormacion();
        closeModalVistaFormacion();
        setEditIdFormacion('');
        setFormFormacion({
            id_categoria:'',
            descripcion:'',
            cantidad_horas:'',
            fecha_emision:'',
            id_institucion:'',
            puntaje:'',
            resolucion:'',
            id_alcance:'',
            id_evaluacion:'',
            id_modalidad:'',
            id_nivel:''
        });
        traeAllFormaciones();
    };

    const submitVerDatosDocente = (datos) =>{
        setModificaVistaFormacion(false);
        console.log('se presiona para ver los datos de la formacion: ', datos);
        console.log('como convierte fechahora: ', formatoFechaHora(datos.fecha_emision));
        const convfecha = formatoFechaHora(datos.fecha_emision).formatoFecha;
        setFormFormacion({
            id_categoria:datos.id_categoria,
            descripcion:datos.descripcion,
            cantidad_horas:datos.cantidad_horas,
            fecha_emision:convfecha,
            id_institucion:datos.id_institucion,
            puntaje:datos.puntaje,
            resolucion:datos.resolucion,
            id_alcance:datos.id_alcance,
            id_evaluacion:datos.id_evaluacion,
            id_modalidad:datos.id_modalidad,
            id_nivel:datos.id_nivel
        });

        setEditIdFormacion(datos.id_formacion);

        openModalVistaFormacion();
    };

    const submitGuardarVistaFormacion = async() => {
        try{
            await axios.put(`${URL}/api/updateformacion/${editIdFormacion}`,formFormacion)
            .then(async res=>{
                setMensajeModalInfo('Formacion Modificada Correctamente');
                openModal();
            })
            .catch(error=>{
                console.log('que tiene error updateFormacion: ', error);
            })
        }catch(error){
            console.log('que traer error guardar modifica formacion: ', error.message);
        }
    };

    const submitCloseModalVistaFormacion = ()=>{
        closeModalVistaFormacion();
        setEditIdFormacion('');
        setFormFormacion({
            id_categoria:'',
            descripcion:'',
            cantidad_horas:'',
            fecha_emision:'',
            id_institucion:'',
            puntaje:'',
            resolucion:'',
            id_alcance:'',
            id_evaluacion:'',
            id_modalidad:'',
            id_nivel:''
        });
    };

    function formatoFechaHora (datetime){
        const date = new Date(datetime);
        //Resto una hora
        date.setHours(date.getHours() );

        const formatoFecha = date.toISOString().slice(0,10);
        const formatoHora = date.toTimeString().slice(0,5);
        return{formatoFecha};
    };

    const handleChangeInstitutoFormacion =(event)=>{
        const{name, value} = event.target;
        console.log('que tiene name: ',name);
        console.log('que tiene value: ',value);
        setInstitutoFormacion(value);
    };

    const handleCancelInstitutoFormacion = () => {
        setInstitutoFormacion('');
    };  


    useEffect(()=>{
        console.log('que tiene inputSearch: ', inputSearch);
        console.log('que tiene inputSearchRes: ', inputSearchRes);
        console.log('que tiene institutoFormacion: ', institutoFormacion);
        traeAllFormaciones(inputSearch, inputSearchRes, institutoFormacion);
    },[inputSearch, inputSearchRes, institutoFormacion]);


    useEffect(()=>{
        console.log('que tiene formFormacion: ', formFormacion);
        if(formFormacion.cantidad_horas!="" && formFormacion.descripcion!="" && formFormacion.fecha_emision!="" && formFormacion.id_alcance!="" && formFormacion.id_categoria!="" && formFormacion.id_evaluacion!="" && formFormacion.id_institucion!="" && formFormacion.id_modalidad!="" & formFormacion.puntaje!="" && formFormacion.resolucion!="" && formFormacion.id_nivel!=""){
            setValidaFormFormacion(true);
        }else{
            setValidaFormFormacion(false);
        }

    },[formFormacion]);


    useEffect(()=>{
        traeAllFormaciones(inputSearch, inputSearchRes);
        traeTablasAuxiliares();
    },[])

  return (
    <div>
        <div>
            <label className='ml-2 text-lg font-bold'>Formacion</label>
        </div>
        {/* CONTENIDO DE PAGINA */}
        <div className='mb-2'>
            {/* PARTE SUPERIOR DE TABLA */}
            <div className="w-[50%] mb-2 flex justify-start items-center">
                {/* BUCADOR  CURSOS*/}
                <div className="w-[50mm] border-[1px] border-purple-500  rounded flex flex-row items-center justify-between mx-2 h-[7mm]">
                    <input 
                        className={` ml-2 focus:outline-none rounded
                            ${(inputSearch!='')
                                ?`w-[35mm]`
                                :`w-[40mm]`
                            }
                            `}
                        placeholder="Buscar curso..."
                        type="text"
                        value={inputSearch}
                        onChange={handleInputSearchChange}
                    />
                    <div className="flex flex-row items-center">
                        {(inputSearch!='') &&
                            <FaTimes
                                className="text-slate-400 cursor-pointer text-lg w-[5mm]"
                                onClick={()=>handleCancelSearch()}
                            />
                        }
                    </div>
                </div>
                {/* BUCADOR  RESOLUCION*/}
                <div className="w-[50mm] border-[1px] border-purple-500  rounded flex flex-row items-center justify-between mx-2 h-[7mm]">
                    <input 
                        className={`w-[15vw] ml-2 focus:outline-none rounded
                            ${(inputSearchRes!='')
                                ?`w-[35mm]`
                                :`w-[40mm]`
                            }
                            `}
                        placeholder="Buscar resolucion..."
                        type="text"
                        value={inputSearchRes}
                        onChange={handleInputSearchChangeRes}
                    />
                    <div className="flex flex-row items-center">
                        {(inputSearchRes!='') &&
                            <FaTimes
                                className="text-slate-400 cursor-pointer text-lg w-[5mm]"
                                onClick={()=>handleCancelSearchRes()}
                            />
                        }
                    </div>
                </div>
                {/* FILTRO BUSQUEDA INSTITUCION */}
                <div className='w-[70mm] my-[2px] mx-2 p-[2px] flex flex-row items-center  border-purple-500 border-[1px] rounded-md'>
                    {/* <label className='mr-2'>Institucion: </label> */}
                    <select 
                        className={` focus:outline-none
                            ${(institutoFormacion!='')
                                ?`w-[60mm]`
                                :`w-[65mm]`
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
                    <div className=''>
                        {(institutoFormacion!='') &&
                            <FaTimes
                                className="text-slate-400 cursor-pointer text-lg w-[5mm]"
                                onClick={()=>handleCancelInstitutoFormacion()}
                            />
                        }
                    </div>
                </div>
                {/* BOTON NUEVO CURSO */}
                <div>
                    <div className="flex flex-row ">
                        {/* <label className="ml-4 text-lg font-sans font-bold">VACANTES</label> */}
                        {(userSG.permiso!=3 && userSG.permiso!=4) &&
                            <button 
                                className="ml-2 px-[2px] border-[1px] border-[#73685F] rounded hover:bg-[#7C8EA6] hover:text-white hover:border-[#7C8EA6] shadow w-[50mm]"
                                onClick={()=>submitNuevaFormacion()}
                            >Nueva Formacion</button>
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
                            <th className='w-[50mm]'>Nivel</th>
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
                                        <td className='w-[50mm] text-center'>{formacion.nivel}</td>
                                        <td>
                                            <div className='flex justify-center'>
                                                <FaEye 
                                                    className="font-bold text-lg mr-2 text-sky-500 hover:scale-150 transition-all duration-500 cursor-pointer"
                                                    title="Ver Datos"
                                                    onClick={()=>submitVerDatosDocente(formacion)}
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

        {/* MODAL NUEVA FORMACION*/}
        <ModalEdit isOpen={isOpenModalNuevaFormacion} closeModal={closeModalNuevaFormacion}>
            <div className="mt-2 w-[40vw] flex flex-col items-center">
                {/* <h1 className="text-xl text-center font-bold">{mensajeModalConfirm}</h1> */}
                <h1 className="text-xl text-center font-bold mb-4">Nueva Formacion</h1>
                <div className="flex flex-col items-end">
                    <div className='my-[2px]'>
                        <label className='mr-2'>Categoria: </label>
                        <select 
                            className='w-[70mm] border-purple-500 border-[1px]'
                            name='id_categoria'
                            value={formFormacion?.id_categoria}
                            onChange={handleChangeValue}
                        >
                            <option value='' selected disabled>Seleccione...</option>
                            {
                                listadoCategorias?.map((categ, index)=>(
                                    <option
                                        key={index}
                                        value={categ.id_categoria}
                                        className='text-base '
                                    >{categ.descripcion}</option>
                                ))
                            }
                        </select>
                        {/* <input className='border-[1px] border-purple-500 w-[50mm]'></input> */}
                    </div>
                    <div className='my-[2px] flex justify-center'>
                        <label className='mr-2'>Descripcion: </label>
                        <textarea 
                            className='border-[1px] border-purple-500 h-[20mm] w-[70mm]'
                            name='descripcion'
                            type='text'
                            value={formFormacion?.descripcion}
                            onChange={handleChangeValue}
                        ></textarea>
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Horas: </label>
                        <input 
                            className='border-[1px] border-purple-500 w-[70mm]'
                            name='cantidad_horas'
                            type='text'
                            value={formFormacion?.cantidad_horas}
                            onChange={handleChangeValue}
                        ></input>
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Emision: </label>
                        <input 
                            className='border-[1px] border-purple-500 w-[70mm]'
                            name='fecha_emision'
                            type='date'
                            value={formFormacion?.fecha_emision}
                            onChange={handleChangeValue}
                        ></input>
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Institucion: </label>
                        <select 
                            className='w-[70mm] border-purple-500 border-[1px]'
                            name='id_institucion'
                            value={formFormacion?.id_institucion}
                            onChange={handleChangeValue}
                        >
                            <option value='' selected disabled>Seleccione...</option>
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
                        {/* <input className='border-[1px] border-purple-500 w-[50mm]'></input> */}
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Puntaje: </label>
                        <input 
                            className='border-[1px] border-purple-500 w-[70mm]'
                            name='puntaje'
                            type='number'
                            value={formFormacion?.puntaje}
                            onChange={handleChangeValue}
                        ></input>
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Resolucion: </label>
                        <input 
                            className='border-[1px] border-purple-500 w-[70mm]'
                            name='resolucion'
                            value={formFormacion?.resolucion}
                            onChange={handleChangeValue}
                        ></input>
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Alcance: </label>
                        <select 
                            className='w-[70mm] border-purple-500 border-[1px]'
                            name='id_alcance'
                            value={formFormacion?.id_alcance}
                            onChange={handleChangeValue}
                        >
                            <option value='' selected disabled>Seleccione...</option>
                            {
                                listadoAlcance?.map((alc, index)=>(
                                    <option
                                        key={index}
                                        value={alc.id_alcance}
                                        className='text-base '
                                    >{alc.descripcion}</option>
                                ))
                            }
                        </select>
                        {/* <input className='border-[1px] border-purple-500 w-[50mm]'></input> */}
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Evaluacion: </label>
                        <select 
                            className='w-[70mm] border-purple-500 border-[1px]'
                            name='id_evaluacion'
                            value={formFormacion?.id_evaluacion}
                            onChange={handleChangeValue}
                        >
                            <option value='' selected disabled>Seleccione...</option>
                            {
                                listadoEvaluacion?.map((evalu, index)=>(
                                    <option
                                        key={index}
                                        value={evalu.id_evaluacion}
                                        className='text-base '
                                    >{evalu.descripcion}</option>
                                ))
                            }
                        </select>
                        {/* <input className='border-[1px] border-purple-500 w-[50mm]'></input> */}
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Modalidad: </label>
                        <select 
                            className='w-[70mm] border-purple-500 border-[1px]'
                            name='id_modalidad'
                            value={formFormacion?.id_modalidad}
                            onChange={handleChangeValue}
                        >
                            <option value='' selected disabled>Seleccione...</option>
                            {
                                listadoModalidad?.map((modal, index)=>(
                                    <option
                                        key={index}
                                        value={modal.id_modalidad}
                                        className='text-base '
                                    >{modal.descripcion}</option>
                                ))
                            }
                        </select>
                        {/* <input className='border-[1px] border-purple-500 w-[50mm]'></input> */}
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Nivel: </label>
                        <select 
                            className='w-[70mm] border-purple-500 border-[1px]'
                            name='id_nivel'
                            value={formFormacion?.id_nivel}
                            onChange={handleChangeValue}
                        >
                            <option value='' selected disabled>Seleccione...</option>
                            {
                                listadoNivel?.map((nivel, index)=>(
                                    <option
                                        key={index}
                                        value={nivel.id_nivel}
                                        className='text-base '
                                    >{nivel.descripcion}</option>
                                ))
                            }
                        </select>
                        {/* <input className='border-[1px] border-purple-500 w-[50mm]'></input> */}
                    </div>
                </div>
                <div className="flex flex-row">
                    {(validaFormFormacion) &&
                        <div className="flex justify-center mr-2">
                            <button
                                className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                                onClick={()=>submitGuardarFormacion()}
                            >GUARDAR</button>
                        </div>
                    }
                    <div className="flex justify-center ml-2">
                        <button
                            className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                            onClick={()=>closeModalNuevaFormacion()}
                        >CANCELAR</button>
                    </div>
                </div>    
            </div>
        </ModalEdit>


        {/* MODAL VISTA FORMACION*/}
        <ModalEdit isOpen={isOpenModalVistaFormacion} closeModal={closeModalVistaFormacion}>
            <div className="mt-2 w-[40vw] flex flex-col items-center">
                {/* <h1 className="text-xl text-center font-bold">{mensajeModalConfirm}</h1> */}
                <h1 className="text-xl text-center font-bold mb-4">Ver Formacion</h1>
                <div className="flex flex-col items-end">
                    <div className='my-[2px]'>
                        <label className='mr-2'>Categoria: </label>
                        <select 
                            className='w-[70mm] border-purple-500 border-[1px]'
                            name='id_categoria'
                            value={formFormacion?.id_categoria}
                            onChange={handleChangeValue}
                        >
                            <option value='' selected disabled>Seleccione...</option>
                            {
                                listadoCategorias?.map((categ, index)=>(
                                    <option
                                        key={index}
                                        value={categ.id_categoria}
                                        className='text-base '
                                    >{categ.descripcion}</option>
                                ))
                            }
                        </select>
                        {/* <input className='border-[1px] border-purple-500 w-[50mm]'></input> */}
                    </div>
                    <div className='my-[2px] flex justify-center'>
                        <label className='mr-2'>Descripcion: </label>
                        {/* <input 
                            className='border-[1px] border-purple-500 w-[70mm]'
                            name='descripcion'
                            type='text'
                            value={formFormacion?.descripcion}
                            onChange={handleChangeValue}
                        ></input> */}
                        <textarea
                            className='border-[1px] border-purple-500 h-[20mm] w-[70mm]'
                            name='descripcion'
                            type='text'
                            value={formFormacion?.descripcion}
                            onChange={handleChangeValue}
                        ></textarea>
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Horas: </label>
                        <input 
                            className='border-[1px] border-purple-500 w-[70mm]'
                            name='cantidad_horas'
                            type='text'
                            value={formFormacion?.cantidad_horas}
                            onChange={handleChangeValue}
                        ></input>
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Emision: </label>
                        <input 
                            className='border-[1px] border-purple-500 w-[70mm]'
                            name='fecha_emision'
                            type='date'
                            value={formFormacion?.fecha_emision}
                            onChange={handleChangeValue}
                        ></input>
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Institucion: </label>
                        <select 
                            className='w-[70mm] border-purple-500 border-[1px]'
                            name='id_institucion'
                            value={formFormacion?.id_institucion}
                            onChange={handleChangeValue}
                        >
                            <option value='' selected disabled>Seleccione...</option>
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
                        {/* <input className='border-[1px] border-purple-500 w-[50mm]'></input> */}
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Puntaje: </label>
                        <input 
                            className='border-[1px] border-purple-500 w-[70mm]'
                            name='puntaje'
                            type='number'
                            value={formFormacion?.puntaje}
                            onChange={handleChangeValue}
                        ></input>
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Resolucion: </label>
                        <input 
                            className='border-[1px] border-purple-500 w-[70mm]'
                            name='resolucion'
                            value={formFormacion?.resolucion}
                            onChange={handleChangeValue}
                        ></input>
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Alcance: </label>
                        <select 
                            className='w-[70mm] border-purple-500 border-[1px]'
                            name='id_alcance'
                            value={formFormacion?.id_alcance}
                            onChange={handleChangeValue}
                        >
                            <option value='' selected disabled>Seleccione...</option>
                            {
                                listadoAlcance?.map((alc, index)=>(
                                    <option
                                        key={index}
                                        value={alc.id_alcance}
                                        className='text-base '
                                    >{alc.descripcion}</option>
                                ))
                            }
                        </select>
                        {/* <input className='border-[1px] border-purple-500 w-[50mm]'></input> */}
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Evaluacion: </label>
                        <select 
                            className='w-[70mm] border-purple-500 border-[1px]'
                            name='id_evaluacion'
                            value={formFormacion?.id_evaluacion}
                            onChange={handleChangeValue}
                        >
                            <option value='' selected disabled>Seleccione...</option>
                            {
                                listadoEvaluacion?.map((evalu, index)=>(
                                    <option
                                        key={index}
                                        value={evalu.id_evaluacion}
                                        className='text-base '
                                    >{evalu.descripcion}</option>
                                ))
                            }
                        </select>
                        {/* <input className='border-[1px] border-purple-500 w-[50mm]'></input> */}
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Modalidad: </label>
                        <select 
                            className='w-[70mm] border-purple-500 border-[1px]'
                            name='id_modalidad'
                            value={formFormacion?.id_modalidad}
                            onChange={handleChangeValue}
                        >
                            <option value='' selected disabled>Seleccione...</option>
                            {
                                listadoModalidad?.map((modal, index)=>(
                                    <option
                                        key={index}
                                        value={modal.id_modalidad}
                                        className='text-base '
                                    >{modal.descripcion}</option>
                                ))
                            }
                        </select>
                        {/* <input className='border-[1px] border-purple-500 w-[50mm]'></input> */}
                    </div>
                    <div className='my-[2px]'>
                        <label className='mr-2'>Nivel: </label>
                        <select 
                            className='w-[70mm] border-purple-500 border-[1px]'
                            name='id_nivel'
                            value={formFormacion?.id_nivel}
                            onChange={handleChangeValue}
                        >
                            <option value='' selected disabled>Seleccione...</option>
                            {
                                listadoNivel?.map((nivel, index)=>(
                                    <option
                                        key={index}
                                        value={nivel.id_nivel}
                                        className='text-base '
                                    >{nivel.descripcion}</option>
                                ))
                            }
                        </select>
                        {/* <input className='border-[1px] border-purple-500 w-[50mm]'></input> */}
                    </div>
                </div>
                <div className="flex flex-row">
                    {(validaFormFormacion && modificaVistaFormacion) &&
                        <div className="flex justify-center mr-2">
                            <button
                                className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                                onClick={()=>submitGuardarVistaFormacion()}
                            >GUARDAR</button>
                        </div>
                    }
                    <div className="flex justify-center ml-2">
                        <button
                            className="border-2 border-[#557CF2] mt-10 font-bold w-40 h-8 bg-[#557CF2] text-white hover:bg-sky-300 hover:border-sky-300"
                            onClick={()=>submitCloseModalVistaFormacion()}
                        >CANCELAR</button>
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
                        onClick={()=>submitCloseModalNotificacion()}
                    >OK</button>
                </div>
            </div>
        </Modal>
    </div>

  )
}

export default Formacion
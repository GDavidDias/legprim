import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './views/home/Home'
import Landing from './views/landing/Landing'

function App() {

  return (
    <div className='m-0'>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/home' element={<Home/>}/>

      </Routes>
    </div>
  )
}

export default App

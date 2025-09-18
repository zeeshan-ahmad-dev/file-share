import { useState } from 'react'
import { Route, Routes, Link } from 'react-router-dom'
import Home from './pages/Home'
import Room from './pages/Room'

function App() {
  return (
    <>
     <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/room/:roomId' element={<Room />}/>
     </Routes>
    </>
  )
}

export default App

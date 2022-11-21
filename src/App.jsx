import React from 'react'
import './App.less'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Home } from './pages/Home'
import { Add } from './pages/Add'
import { Edit } from './pages/Edit'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path='/' element={<Home/>}/>
      <Route path='/add' element={<Add/>}/>
      <Route path="/edit/:id" element={<Edit />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;
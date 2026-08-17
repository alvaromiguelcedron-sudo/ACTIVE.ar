import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/Navbar'
import { CarritoProvider } from './context/CarritoContext'

import Home from './views/Home'
import Ropa from './views/Ropa'
import Gym from './views/Gym'
import Contacto from './views/Contacto'
import ProductoDetalle from './views/ProductoDetalle'

const App = () => {
  return (
    <BrowserRouter>

      <CarritoProvider>

        <Navbar />

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/ropa" element={<Ropa />} />

          <Route path="/gym" element={<Gym />} />

          <Route path="/contacto" element={<Contacto />} />

          <Route path="/ropa/:id" element={<ProductoDetalle />} />

        </Routes>

      </CarritoProvider>

    </BrowserRouter>
  )
}

export default App
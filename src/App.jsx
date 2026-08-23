import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/Navbar'
import { CarritoProvider } from './context/CarritoContext'
import Home from './views/Home'
import Ropa from './views/Ropa'
import Gym from './views/Gym'
import Contacto from './views/Contacto'
import ProductoDetalle from './views/ProductoDetalle'
import Carrito from './views/Carrito'
import Admin from './views/Admin'
import LoginAdmin from './views/LoginAdmin'
import ProtectedRoute from './components/ProtectedRoute'
import Registro from './views/Registro'

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

          <Route path="/gym/:id" element={<ProductoDetalle />} />

          <Route path="/carrito" element={<Carrito />} />

          <Route path="/login-admin" element={<LoginAdmin />} />

          <Route path="/login" element={<LoginAdmin />} />

          <Route path="/registro" element={<Registro />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

        </Routes>

      </CarritoProvider>

    </BrowserRouter>

  )

}

export default App
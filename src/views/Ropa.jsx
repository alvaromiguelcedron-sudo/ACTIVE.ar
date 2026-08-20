import ProductCard from '../components/ProductCard'
import productos from '../helpers/productos'

const Ropa = () => {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">

      <div className="max-w-7xl mx-auto">

        {/* Encabezado */}
        <div className="text-center mb-12">
          <p className="text-blue-900 font-semibold tracking-widest">
            ACTIVE
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            Ropa deportiva
          </h1>

          <p className="text-gray-600 mt-4">
            Descubrí nuestra colección de indumentaria deportiva.
          </p>
        </div>

        {/* Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {productos.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              categoria="ropa"
            />
          ))}

        </div>

      </div>

    </main>
  )
}

export default Ropa
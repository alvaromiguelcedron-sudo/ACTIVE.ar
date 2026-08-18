import { Link } from 'react-router'

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <div>
          <Link to="/" className="block">
            <h1 className="text-2xl font-bold text-blue-900">
              ACTIVE
            </h1>

            <p className="text-xs text-gray-500">
              MEN'S SPORTSWEAR
            </p>
          </Link>
        </div>

        {/* Menú */}
        <div className="flex gap-6 items-center">

          <Link
            to="/"
            className="text-gray-700 hover:text-blue-900 font-medium"
          >
            Inicio
          </Link>

          <Link
            to="/ropa"
            className="text-gray-700 hover:text-blue-900 font-medium"
          >
            Ropa
          </Link>

          <Link
            to="/gym"
            className="text-gray-700 hover:text-blue-900 font-medium"
          >
            Gym
          </Link>

          <Link
            to="/contacto"
            className="text-gray-700 hover:text-blue-900 font-medium"
          >
            Contacto
          </Link>

        </div>

      </div>
    </nav>
  )
}

export default Navbar
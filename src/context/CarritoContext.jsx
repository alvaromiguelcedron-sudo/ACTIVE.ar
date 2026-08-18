import { createContext, useContext, useState } from "react";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  // Agregar un producto al carrito
  const agregarAlCarrito = (producto, color, talle, cantidad) => {
    const productoCarrito = {
      ...producto,
      colorSeleccionado: color,
      talleSeleccionado: talle,
      cantidad: cantidad,
    };

    setCarrito((carritoActual) => [
      ...carritoActual,
      productoCarrito,
    ]);
  };

  // Eliminar un producto del carrito
  const eliminarDelCarrito = (indice) => {
    setCarrito((carritoActual) =>
      carritoActual.filter((_, index) => index !== indice)
    );
  };

  // Vaciar todo el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

// Hook para utilizar el carrito
export const useCarrito = () => {
  return useContext(CarritoContext);
};
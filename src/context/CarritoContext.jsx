import { createContext, useContext, useState } from "react";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  // ==============================
  // AGREGAR PRODUCTO AL CARRITO
  // ==============================
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

  // ==============================
  // AUMENTAR CANTIDAD
  // ==============================
  const aumentarCantidad = (indice) => {
    setCarrito((carritoActual) =>
      carritoActual.map((producto, index) =>
        index === indice
          ? {
              ...producto,
              cantidad: producto.cantidad + 1,
            }
          : producto
      )
    );
  };

  // ==============================
  // DISMINUIR CANTIDAD
  // ==============================
  const disminuirCantidad = (indice) => {
    setCarrito((carritoActual) =>
      carritoActual.map((producto, index) =>
        index === indice
          ? {
              ...producto,
              cantidad: Math.max(1, producto.cantidad - 1),
            }
          : producto
      )
    );
  };

  // ==============================
  // ELIMINAR PRODUCTO DEL CARRITO
  // ==============================
  const eliminarDelCarrito = (indice) => {
    setCarrito((carritoActual) =>
      carritoActual.filter((_, index) => index !== indice)
    );
  };

  // ==============================
  // VACIAR TODO EL CARRITO
  // ==============================
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        aumentarCantidad,
        disminuirCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

// ==============================
// HOOK PARA UTILIZAR EL CARRITO
// ==============================
export const useCarrito = () => {
  return useContext(CarritoContext);
};
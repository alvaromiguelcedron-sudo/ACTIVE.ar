import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

const Admin = () => {
  // ==========================================
  // DATOS DEL PRODUCTO
  // ==========================================

  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState("");

  const [categorias, setCategorias] = useState("");
  const [genero, setGenero] = useState("");

  const [descripcion, setDescripcion] = useState("");
  const [colores, setColores] = useState("");
  const [existencias, setExistencias] = useState("");

  // ==========================================
  // IMAGEN
  // ==========================================

  const [imagen, setImagen] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState("");

  const inputImagenRef = useRef(null);

  // ==========================================
  // PRODUCTOS
  // ==========================================

  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);

  // ==========================================
  // EDICIÓN
  // ==========================================

  const [editandoId, setEditandoId] = useState(null);

  // ==========================================
  // ESTADO
  // ==========================================

  const [guardando, setGuardando] = useState(false);

  // ==========================================
  // SELECCIONAR IMAGEN
  // ==========================================

  const seleccionarImagen = (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith("image/")) {
      alert("Seleccioná un archivo de imagen válido.");
      e.target.value = "";
      return;
    }

    setImagen(archivo);

    const url = URL.createObjectURL(archivo);
    setVistaPrevia(url);
  };

  // ==========================================
  // OBTENER PRODUCTOS
  // ==========================================

  const obtenerProductos = async () => {
    setCargandoProductos(true);

    const { data, error } = await supabase
      .from("productos")
      .select(
        `
        id,
        created_at,
        nombre,
        marca,
        precio,
        categorias,
        colores,
        alturas,
        existencias,
        imagen_url,
        genero,
        descripcion
        `
      )
      .order("id", {
        ascending: false,
      });

    if (error) {
      console.error(
        "ERROR OBTENIENDO PRODUCTOS:",
        error
      );

      setProductos([]);
      setCargandoProductos(false);
      return;
    }

    console.log(
      "PRODUCTOS CORRECTAMENTE:",
      data
    );

    setProductos(data || []);
    setCargandoProductos(false);
  };

  // ==========================================
  // CARGAR PRODUCTOS AL ABRIR ADMIN
  // ==========================================

  useEffect(() => {
    obtenerProductos();
  }, []);

  // ==========================================
  // LIMPIAR FORMULARIO
  // ==========================================

  const limpiarFormulario = () => {
    setNombre("");
    setMarca("");
    setPrecio("");
    setCategorias("");
    setGenero("");
    setDescripcion("");
    setColores("");
    setExistencias("");

    setImagen(null);
    setVistaPrevia("");

    setEditandoId(null);

    if (inputImagenRef.current) {
      inputImagenRef.current.value = "";
    }
  };

  // ==========================================
  // CAMBIAR CATEGORÍA
  // ==========================================

  const cambiarCategoria = (e) => {
    const nuevaCategoria = e.target.value;

    setCategorias(nuevaCategoria);

    if (nuevaCategoria !== "gym") {
      setGenero("");
    }
  };

  // ==========================================
  // EDITAR PRODUCTO
  // ==========================================

  const editarProducto = (producto) => {
    console.log(
      "PRODUCTO PARA EDITAR:",
      producto
    );

    setNombre(producto.nombre || "");
    setMarca(producto.marca || "");
    setPrecio(producto.precio ?? "");

    setCategorias(producto.categorias || "");

    setGenero(producto.genero || "");

    setDescripcion(
      producto.descripcion || ""
    );

    // COLORES
    if (Array.isArray(producto.colores)) {
      setColores(
        producto.colores.join(", ")
      );
    } else {
      setColores(producto.colores || "");
    }

    setExistencias(
      producto.existencias ?? ""
    );

    // IMAGEN ACTUAL
    setVistaPrevia(
      producto.imagen_url || ""
    );

    // No hay imagen nueva seleccionada todavía
    setImagen(null);

    // ID REAL
    setEditandoId(producto.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CANCELAR EDICIÓN
  // ==========================================

  const cancelarEdicion = () => {
    const confirmar = window.confirm(
      "¿Querés cancelar la edición?"
    );

    if (!confirmar) {
      return;
    }

    limpiarFormulario();
  };

  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este producto?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const producto = productos.find(
        (item) => item.id === id
      );

      // ========================================
      // ELIMINAR PRODUCTO DE LA TABLA
      // ========================================

      const { error: errorProducto } =
        await supabase
          .from("productos")
          .delete()
          .eq("id", id);

      if (errorProducto) {
        console.error(
          "ERROR ELIMINANDO PRODUCTO:",
          errorProducto
        );

        alert(
          `No se pudo eliminar el producto.\n\n${errorProducto.message}`
        );

        return;
      }

      // ========================================
      // ELIMINAR IMAGEN DEL STORAGE
      // ========================================

      if (producto?.imagen_url) {
        try {
          const url = new URL(
            producto.imagen_url
          );

          const partes =
            url.pathname.split("/");

          const indiceProductos =
            partes.indexOf("productos");

          if (indiceProductos !== -1) {
            const nombreArchivo =
              partes
                .slice(indiceProductos + 1)
                .join("/");

            if (nombreArchivo) {
              const {
                error: errorImagen,
              } = await supabase.storage
                .from("productos")
                .remove([
                  nombreArchivo,
                ]);

              if (errorImagen) {
                console.error(
                  "ERROR ELIMINANDO IMAGEN:",
                  errorImagen
                );
              }
            }
          }
        } catch (errorImagen) {
          console.error(
            "ERROR PROCESANDO URL DE IMAGEN:",
            errorImagen
          );
        }
      }

      alert(
        "Producto eliminado correctamente."
      );

      if (editandoId === id) {
        limpiarFormulario();
      }

      await obtenerProductos();
    } catch (error) {
      console.error(
        "ERROR INESPERADO ELIMINANDO:",
        error
      );

      alert(
        `Ocurrió un error.\n\n${error.message}`
      );
    }
  };

  // ==========================================
  // GUARDAR PRODUCTO
  // ==========================================

  const guardarProducto = async (e) => {
    e.preventDefault();

    if (guardando) {
      return;
    }

    // ========================================
    // VALIDACIONES
    // ========================================

    if (
      !nombre.trim() ||
      !marca.trim() ||
      precio === "" ||
      !categorias ||
      !descripcion.trim() ||
      !colores.trim() ||
      existencias === ""
    ) {
      alert(
        "Completá todos los campos."
      );

      return;
    }

    // ========================================
    // GYM NECESITA GÉNERO
    // ========================================

    if (
      categorias === "gym" &&
      !genero
    ) {
      alert(
        "Seleccioná Hombre o Mujer para el producto de Gym."
      );

      return;
    }

    // ========================================
    // ROPA NO GUARDA GÉNERO
    // ========================================

    const generoParaGuardar =
      categorias === "gym"
        ? genero
        : null;

    // ========================================
    // IMAGEN OBLIGATORIA AL CREAR
    // ========================================

    if (!editandoId && !imagen) {
      alert(
        "Seleccioná una imagen para el producto."
      );

      return;
    }

    setGuardando(true);

    let imagenSubidaNueva = null;

    try {
      // ========================================
      // CONVERTIR COLORES
      // ========================================

      const coloresArray = colores
        .split(",")
        .map((color) => color.trim())
        .filter(
          (color) => color !== ""
        );

      // ========================================
      // EDITAR PRODUCTO
      // ========================================

      if (editandoId) {
        let imagenUrlActual = null;

        const productoActual =
          productos.find(
            (producto) =>
              producto.id === editandoId
          );

        imagenUrlActual =
          productoActual?.imagen_url ||
          null;

        // ======================================
        // SI HAY IMAGEN NUEVA
        // ======================================

        if (imagen) {
          const nombreArchivo =
            `${Date.now()}-${imagen.name
              .replace(/\s+/g, "-")
              .replace(/[^a-zA-Z0-9._-]/g, "")}`;

          console.log(
            "SUBIENDO NUEVA IMAGEN:",
            nombreArchivo
          );

          const {
            error: errorImagen,
          } = await supabase.storage
            .from("productos")
            .upload(
              nombreArchivo,
              imagen,
              {
                cacheControl: "3600",
                upsert: false,
                contentType:
                  imagen.type,
              }
            );

          if (errorImagen) {
            console.error(
              "ERROR SUBIENDO IMAGEN:",
              errorImagen
            );

            alert(
              `Hubo un error al subir la imagen.\n\n${errorImagen.message}`
            );

            setGuardando(false);
            return;
          }

          imagenSubidaNueva =
            nombreArchivo;

          const {
            data: datosImagen,
          } = supabase.storage
            .from("productos")
            .getPublicUrl(
              nombreArchivo
            );

          imagenUrlActual =
            datosImagen.publicUrl;
        }

        // ======================================
        // ACTUALIZAR PRODUCTO
        // ======================================

        const {
          error: errorActualizacion,
        } = await supabase
          .from("productos")
          .update({
            nombre: nombre.trim(),
            marca: marca.trim(),
            precio: Number(precio),

            categorias:
              categorias,

            descripcion:
              descripcion.trim(),

            colores:
              coloresArray,

            existencias:
              Number(existencias),

            imagen_url:
              imagenUrlActual,

            genero:
              generoParaGuardar,
          })
          .eq("id", editandoId);

        if (errorActualizacion) {
          console.error(
            "ERROR ACTUALIZANDO PRODUCTO:",
            errorActualizacion
          );

          // Si subimos una imagen nueva
          // pero falló la actualización,
          // la eliminamos.
          if (imagenSubidaNueva) {
            await supabase.storage
              .from("productos")
              .remove([
                imagenSubidaNueva,
              ]);
          }

          alert(
            `No se pudo actualizar el producto.\n\n${errorActualizacion.message}`
          );

          setGuardando(false);
          return;
        }

        alert(
          "¡Producto actualizado correctamente!"
        );

        limpiarFormulario();

        await obtenerProductos();

        setGuardando(false);
        return;
      }

      // ==========================================
      // CREAR PRODUCTO NUEVO
      // ==========================================

      const nombreArchivo =
        `${Date.now()}-${imagen.name
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9._-]/g, "")}`;

      console.log(
        "SUBIENDO IMAGEN:",
        nombreArchivo
      );

      // ========================================
      // SUBIR IMAGEN A STORAGE
      // ========================================

      const {
        error: errorImagen,
      } = await supabase.storage
        .from("productos")
        .upload(
          nombreArchivo,
          imagen,
          {
            cacheControl: "3600",
            upsert: false,
            contentType:
              imagen.type,
          }
        );

      if (errorImagen) {
        console.error(
          "ERROR SUBIENDO IMAGEN:",
          errorImagen
        );

        alert(
          `Hubo un error al subir la imagen.\n\n${errorImagen.message}`
        );

        setGuardando(false);
        return;
      }

      imagenSubidaNueva =
        nombreArchivo;

      console.log(
        "IMAGEN SUBIDA CORRECTAMENTE"
      );

      // ========================================
      // OBTENER URL PÚBLICA
      // ========================================

      const {
        data: datosImagen,
      } = supabase.storage
        .from("productos")
        .getPublicUrl(
          nombreArchivo
        );

      const imagenUrl =
        datosImagen.publicUrl;

      console.log(
        "URL DE IMAGEN:",
        imagenUrl
      );

      // ========================================
      // CREAR PRODUCTO
      // ========================================
      //
      // IMPORTANTE:
      // ESTOS SON LOS NOMBRES REALES
      // DE TU TABLA productos.
      // ========================================

      const productoNuevo = {
        nombre:
          nombre.trim(),

        marca:
          marca.trim(),

        precio:
          Number(precio),

        categorias:
          categorias,

        descripcion:
          descripcion.trim(),

        colores:
          coloresArray,

        existencias:
          Number(existencias),

        imagen_url:
          imagenUrl,

        genero:
          generoParaGuardar,
      };

      console.log(
        "PRODUCTO QUE SE VA A GUARDAR:",
        productoNuevo
      );

      const {
        data,
        error,
      } = await supabase
        .from("productos")
        .insert([
          productoNuevo,
        ])
        .select();

      // ========================================
      // ERROR GUARDANDO
      // ========================================

      if (error) {
        console.error(
          "================================"
        );

        console.error(
          "ERROR GUARDANDO PRODUCTO:"
        );

        console.error(error);

        console.error(
          "================================"
        );

        // Si la imagen se subió pero
        // el producto no se pudo guardar,
        // eliminamos la imagen para no dejar
        // archivos basura en Storage.

        if (imagenSubidaNueva) {
          const {
            error: errorEliminar,
          } = await supabase.storage
            .from("productos")
            .remove([
              imagenSubidaNueva,
            ]);

          if (errorEliminar) {
            console.error(
              "NO SE PUDO ELIMINAR LA IMAGEN:",
              errorEliminar
            );
          }
        }

        alert(
          `No se pudo guardar el producto.\n\n${error.message}`
        );

        setGuardando(false);
        return;
      }

      // ========================================
      // PRODUCTO GUARDADO
      // ========================================

      console.log(
        "PRODUCTO GUARDADO CORRECTAMENTE:",
        data
      );

      alert(
        "¡Producto guardado correctamente!"
      );

      // ========================================
      // LIMPIAR
      // ========================================

      limpiarFormulario();

      // ========================================
      // ACTUALIZAR LISTA
      // ========================================

      await obtenerProductos();

    } catch (error) {
      console.error(
        "ERROR INESPERADO:",
        error
      );

      if (imagenSubidaNueva) {
        await supabase.storage
          .from("productos")
          .remove([
            imagenSubidaNueva,
          ]);
      }

      alert(
        `Ocurrió un error inesperado.\n\n${error.message}`
      );
    } finally {
      setGuardando(false);
    }
  };

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* TÍTULO */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Administrador
          </h1>

          <p className="text-gray-600 mt-2">
            Gestioná los productos de ACTIVE.ar
          </p>

        </div>

        {/* ====================================
            FORMULARIO
        ==================================== */}

        <form
          onSubmit={guardarProducto}
          className="bg-white p-6 rounded-xl shadow-md space-y-5"
        >

          <h2 className="text-2xl font-bold text-gray-900">
            {editandoId
              ? "Editar producto"
              : "Agregar nuevo producto"}
          </h2>

          {/* CATEGORÍA */}

          <div>

            <label className="block font-medium mb-1">
              ¿Dónde querés cargar el producto?
            </label>

            <select
              value={categorias}
              onChange={cambiarCategoria}
              className="w-full border rounded-lg px-3 py-2 bg-white"
            >

              <option value="">
                Seleccioná una categoría
              </option>

              <option value="ropa">
                Ropa
              </option>

              <option value="gym">
                Gym
              </option>

            </select>

          </div>

          {/* GÉNERO */}

          {categorias === "gym" && (
            <div>

              <label className="block font-medium mb-1">
                ¿Para quién es?
              </label>

              <select
                value={genero}
                onChange={(e) =>
                  setGenero(e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 bg-white"
              >

                <option value="">
                  Seleccioná género
                </option>

                <option value="hombre">
                  Hombre
                </option>

                <option value="mujer">
                  Mujer
                </option>

              </select>

            </div>
          )}

          {/* IMAGEN */}

          <div>

            <label className="block font-medium mb-1">
              Imagen del producto
            </label>

            <input
              ref={inputImagenRef}
              type="file"
              accept="image/*"
              onChange={seleccionarImagen}
              className="w-full border rounded-lg px-3 py-2"
            />

            {vistaPrevia && (
              <div className="mt-4">

                <p className="text-sm text-gray-500 mb-2">
                  Vista previa:
                </p>

                <img
                  src={vistaPrevia}
                  alt="Vista previa"
                  className="w-48 h-48 object-cover rounded-lg border"
                />

              </div>
            )}

          </div>

          {/* NOMBRE */}

          <div>

            <label className="block font-medium mb-1">
              Nombre del producto
            </label>

            <input
              type="text"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
              placeholder="Ej: Buso"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

          {/* MARCA */}

          <div>

            <label className="block font-medium mb-1">
              Marca
            </label>

            <input
              type="text"
              value={marca}
              onChange={(e) =>
                setMarca(e.target.value)
              }
              placeholder="Ej: Puma"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

          {/* PRECIO */}

          <div>

            <label className="block font-medium mb-1">
              Precio
            </label>

            <input
              type="number"
              value={precio}
              onChange={(e) =>
                setPrecio(e.target.value)
              }
              placeholder="Ej: 40000"
              min="0"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

          {/* DESCRIPCIÓN */}

          <div>

            <label className="block font-medium mb-1">
              Descripción
            </label>

            <textarea
              value={descripcion}
              onChange={(e) =>
                setDescripcion(
                  e.target.value
                )
              }
              placeholder="Descripción del producto"
              rows="4"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

          {/* COLORES */}

          <div>

            <label className="block font-medium mb-1">
              Colores
            </label>

            <input
              type="text"
              value={colores}
              onChange={(e) =>
                setColores(e.target.value)
              }
              placeholder="Ej: Negro, Gris, Blanco"
              className="w-full border rounded-lg px-3 py-2"
            />

            <p className="text-sm text-gray-500 mt-1">
              Separalos con comas.
            </p>

          </div>

          {/* EXISTENCIAS */}

          <div>

            <label className="block font-medium mb-1">
              Existencias
            </label>

            <input
              type="number"
              value={existencias}
              onChange={(e) =>
                setExistencias(
                  e.target.value
                )
              }
              placeholder="Ej: 10"
              min="0"
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>

          {/* BOTONES */}

          <div className="flex flex-col gap-3">

            <button
              type="submit"
              disabled={guardando}
              className={`w-full text-white py-3 rounded-lg font-semibold transition ${
                guardando
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-900 hover:bg-blue-800"
              }`}
            >

              {guardando
                ? "Guardando producto..."
                : editandoId
                ? "Actualizar producto"
                : "Guardar producto"}

            </button>

            {editandoId && (
              <button
                type="button"
                onClick={cancelarEdicion}
                disabled={guardando}
                className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
              >
                Cancelar edición
              </button>
            )}

          </div>

        </form>

        {/* ====================================
            PRODUCTOS CARGADOS
        ==================================== */}

        <section className="mt-12">

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Productos cargados
          </h2>

          {cargandoProductos && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600">
                Cargando productos...
              </p>
            </div>
          )}

          {!cargandoProductos &&
            productos.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-600">
                  No hay productos cargados.
                </p>
              </div>
            )}

          {!cargandoProductos &&
            productos.length > 0 && (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {productos.map((producto) => (

                  <article
                    key={producto.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >

                    {/* IMAGEN */}

                    <div className="w-full h-64 bg-gray-100 overflow-hidden">

                      {producto.imagen_url ? (

                        <img
                          src={producto.imagen_url}
                          alt={producto.nombre}
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sin imagen
                        </div>

                      )}

                    </div>

                    {/* INFORMACIÓN */}

                    <div className="p-5">

                      <h3 className="text-xl font-bold text-gray-900">
                        {producto.nombre}
                      </h3>

                      <p className="text-gray-500 mt-1">
                        {producto.marca}
                      </p>

                      <p className="text-gray-600 mt-2">
                        Categoría:{" "}
                        <span className="font-medium">
                          {producto.categorias === "gym"
                            ? "Gym"
                            : "Ropa"}
                        </span>
                      </p>

                      {producto.genero && (
                        <p className="text-gray-600 mt-1">
                          Género:{" "}
                          <span className="font-medium capitalize">
                            {producto.genero}
                          </span>
                        </p>
                      )}

                      <p className="text-blue-900 font-bold text-xl mt-3">
                        $
                        {Number(
                          producto.precio
                        ).toLocaleString(
                          "es-AR"
                        )}
                      </p>

                      <p className="text-gray-600 mt-2">
                        Stock:{" "}
                        {producto.existencias}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          editarProducto(
                            producto
                          )
                        }
                        className="w-full mt-4 bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition"
                      >
                        Editar producto
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarProducto(
                            producto.id
                          )
                        }
                        className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        Eliminar producto
                      </button>

                    </div>

                  </article>

                ))}

              </div>

            )}

        </section>

      </div>

    </main>
  );
};

export default Admin;
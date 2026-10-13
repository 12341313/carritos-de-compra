
// CLASE CLIENTE
// Guarda los datos y permite registrar, iniciar sesión y modificarlos.

class Cliente {
    constructor(nombre, correo, direccionEnvio, usuario, contraseña) {
        this.nombre = nombre;
        this.correo = correo;
        this.direccionEnvio = direccionEnvio;
        this.usuario = usuario;
        this.contraseña = contraseña;
    }

    registrar() {
        clientes.push(this); // Guarda el cliente en memoria.
        guardarClientes();
    }

    iniciarSesion(usuario, contraseña) {
        return this.usuario === usuario && this.contraseña === contraseña;
    }

    modificarDatos(nombre, correo, direccionEnvio, usuario, contraseña) {
        this.nombre = nombre;
        this.correo = correo;
        this.direccionEnvio = direccionEnvio;
        this.usuario = usuario;
        this.contraseña = contraseña;
    }
}

// =========================
// CLASE CARRITO DE COMPRAS
// =========================
class CarritoCompra {
    constructor() {
        this.listaProductos = [];
        this.total = 0;
    }

    agregarProducto(producto) {
        const existente = this.listaProductos.find(item => item.producto.idProducto === producto.idProducto);
        if (existente) {
            if (existente.cantidad < producto.stock) existente.cantidad++;
        } else if (producto.stock > 0) {
            this.listaProductos.push({ producto: producto, cantidad: 1 });
        }
        this.calcularTotal();
    }

    eliminarProducto(idProducto) {
        this.listaProductos = this.listaProductos.filter(item => item.producto.idProducto !== idProducto);
        this.calcularTotal();
    }

    actualizarCantidad(idProducto, cantidad) {
        const item = this.listaProductos.find(elemento => elemento.producto.idProducto === idProducto);
        if (!item) return;
        if (cantidad <= 0) {
            this.eliminarProducto(idProducto);
            return;
        }
        if (cantidad <= item.producto.stock) item.cantidad = cantidad;
        this.calcularTotal();
    }

    calcularTotal() {
        this.total = this.listaProductos.reduce((suma, item) => suma + item.producto.precio * item.cantidad, 0);
        return this.total;
    }
}

// =========================
// CLASE ORDEN DE COMPRA
// =========================
class Orden {
    constructor(numeroOrden, cliente, listaProductos, total) {
        this.numeroOrden = numeroOrden;
        this.cliente = cliente;
        this.listaProductos = listaProductos.map(item => ({
            producto: item.producto,
            cantidad: item.cantidad
        }));
        this.total = total;
        this.fecha = new Date();
        this.estado = "Confirmada";
    }

    generarOrden() {
        return this;
    }

    mostrarResumen() {
        return this.listaProductos;
    }
}

// =========================
// DATOS SIMULADOS EN MEMORIA
// =========================
const STORAGE_KEY = "tecnoCompra_clientes";
const SESSION_KEY = "tecnoCompra_clienteActual";

function guardarClientes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
}

function guardarSesion() {
    if (!clienteActual) {
        localStorage.removeItem(SESSION_KEY);
        return;
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify({
        usuario: clienteActual.usuario,
        contraseña: clienteActual.contraseña
    }));
}

const clientes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let clienteActual = null;
let intentosFallidos = 0;
let accesoBloqueado = false;
const carrito = new CarritoCompra();

const sesionGuardada = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
if (sesionGuardada) {
    const usuarioGuardado = clientes.find(cliente =>
        cliente.usuario === sesionGuardada.usuario && cliente.contraseña === sesionGuardada.contraseña
    );
    if (usuarioGuardado) {
        clienteActual = usuarioGuardado;
    }
}

// Productos de ejemplo para el catálogo
const productos = [
    new Laptop(1, "Laptop Nova", "Laptop para estudiar y trabajar.", 2450000, 5, "💻", "Intel Core i5", "8 GB", "512 GB SSD"),
    new Laptop(2, "Laptop Pro", "Laptop para tareas y trabajo diario.", 3200000, 4, "💻", "Intel Core i7", "16 GB", "1 TB SSD"),
    new Smartphone(3, "Smartphone X", "Celular con pantalla amplia.", 1250000, 8, "📱", "Android", "6.5 pulgadas", "50 MP"),
    new Smartphone(4, "Smartphone Air", "Celular para comunicación y aplicaciones.", 980000, 7, "📱", "Android", "6.1 pulgadas", "48 MP"),
    new Accesorio(5, "Audífonos", "Audífonos para escuchar música.", 85000, 15, "🎧", "Audífonos"),
    new Accesorio(6, "Mouse inalámbrico", "Mouse cómodo para computador.", 55000, 20, "🖱️", "Mouse")
];

// Función para encontrar elementos del HTML por su id.
const porId = id => document.getElementById(id);

// Muestra una vista y oculta las demás.
function mostrarVista(nombre) {
    document.querySelectorAll(".vista").forEach(vista => vista.classList.add("oculto"));
    porId(`vista-${nombre}`).classList.remove("oculto");
    if (nombre === "catalogo") mostrarProductos();
    if (nombre === "carrito") mostrarCarrito();
    if (nombre === "datos") mostrarDatos();
    window.scrollTo(0, 0);
}

// Da formato de pesos colombianos a los precios.
function dinero(valor) {
    return valor.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

// Muestra el mensaje en un lugar de la página.
function mensaje(id, texto, esError = false) {
    const elemento = porId(id);
    elemento.textContent = texto;
    elemento.className = esError ? "mensaje error" : "mensaje exito";
}

// Dibuja las tarjetas del catálogo usando los productos disponibles.
function mostrarProductos() {
    const contenedor = porId("lista-productos");
    contenedor.innerHTML = "";

    productos.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-producto";
        tarjeta.innerHTML = `
            <div class="imagen-producto" aria-hidden="true">${producto.imagen}</div>
            <div class="contenido-producto">
                <h2>${producto.nombre}</h2>
                <p>${producto.mostrarInfo()}</p>
                <span class="precio">${dinero(producto.precio)}</span>
                <span class="stock">Unidades disponibles: ${producto.stock}</span>
                <button class="boton principal" data-agregar="${producto.idProducto}">Agregar al carrito</button>
            </div>`;
        contenedor.appendChild(tarjeta);
    });
}

// Dibuja los productos añadidos al carrito y calcula el total.
function mostrarCarrito() {
    const contenedor = porId("lista-carrito");
    contenedor.innerHTML = "";

    if (carrito.listaProductos.length === 0) {
        contenedor.innerHTML = '<div class="vacio">Tu carrito está vacío. Ve al catálogo para agregar productos.</div>';
    }

    carrito.listaProductos.forEach(item => {
        const fila = document.createElement("article");
        fila.className = "item-carrito";
        fila.innerHTML = `
            <div><h3>${item.producto.nombre}</h3>
            <p>${dinero(item.producto.precio)} por unidad</p></div>
            <div class="controles-cantidad">
                <button data-restar="${item.producto.idProducto}" aria-label="Restar una unidad">−</button>
                <strong>${item.cantidad}</strong>
                <button data-sumar="${item.producto.idProducto}" aria-label="Sumar una unidad">+</button>
            </div>
            <button class="eliminar" data-eliminar="${item.producto.idProducto}">Eliminar</button>`;
        contenedor.appendChild(fila);
    });

    porId("total-carrito").textContent = dinero(carrito.calcularTotal());
    porId("cantidad-carrito").textContent = carrito.listaProductos.reduce((suma, item) => suma + item.cantidad, 0);
}

// Verifica que el usuario haya iniciado sesión antes de comprar.
function necesitaSesion() {
    if (!clienteActual) {
        mensaje("mensaje-carrito", "Primero inicia sesión o registra un usuario.", true);
        mostrarVista("inicio");
        return false;
    }
    return true;
}

// Registra un usuario nuevo.
porId("form-registro").addEventListener("submit", evento => {
    evento.preventDefault();
    const nombre = porId("registro-nombre").value.trim();
    const correo = porId("registro-correo").value.trim();
    const direccion = porId("registro-direccion").value.trim();
    const usuario = porId("registro-usuario").value.trim();
    const contraseña = porId("registro-clave").value;

    if (clientes.some(cliente => cliente.usuario === usuario)) {
        mensaje("mensaje-registro", "Ese nombre de usuario ya existe.", true);
        return;
    }

    const nuevoCliente = new Cliente(nombre, correo, direccion, usuario, contraseña);
    nuevoCliente.registrar();
    porId("form-registro").reset();
    mensaje("mensaje-registro", "Usuario registrado. Ya puedes iniciar sesión.");
});

// Inicia sesión y bloquea después de tres intentos fallidos.
porId("form-login").addEventListener("submit", evento => {
    evento.preventDefault();
    if (accesoBloqueado) {
        mensaje("mensaje-login", "Acceso bloqueado por tres intentos fallidos. Recarga la página para reiniciar la demostración.", true);
        return;
    }

    const usuario = porId("login-usuario").value.trim();
    const contraseña = porId("login-clave").value;
    const encontrado = clientes.find(cliente => cliente.iniciarSesion(usuario, contraseña));

    if (encontrado) {
        clienteActual = encontrado;
        guardarSesion();
        intentosFallidos = 0;
        porId("form-login").reset();
        mensaje("mensaje-login", `Bienvenido/a, ${clienteActual.nombre}.`);
        mostrarVista("catalogo");
    } else {
        intentosFallidos++;
        const restantes = 3 - intentosFallidos;
        if (restantes <= 0) accesoBloqueado = true;
        mensaje("mensaje-login", accesoBloqueado
            ? "Has llegado a tres intentos fallidos. El acceso quedó bloqueado."
            : `Usuario o contraseña incorrectos. Intentos restantes: ${restantes}.`, true);
    }
});

// Permite modificar los datos del usuario que inició sesión.
function cerrarSesion() {
    clienteActual = null;
    carrito.listaProductos = [];
    carrito.calcularTotal();
    guardarSesion();
    mostrarCarrito();
    porId("form-login").reset();
    porId("form-datos").reset();
    mensaje("mensaje-login", "Has cerrado sesión.");
    mostrarVista("inicio");

    const botonHeader = porId("cerrar-sesion-header");
    if (botonHeader) botonHeader.classList.add("oculto");
    const botonDatos = porId("cerrar-sesion");
    if (botonDatos) botonDatos.classList.add("oculto");
}

function mostrarDatos() {
    const formulario = porId("form-datos");
    const botonHeader = porId("cerrar-sesion-header");
    const botonDatos = porId("cerrar-sesion");

    if (!clienteActual) {
        porId("estado-sesion").textContent = "Inicia sesión para consultar o modificar tus datos.";
        formulario.classList.add("oculto");
        if (botonHeader) botonHeader.classList.add("oculto");
        if (botonDatos) botonDatos.classList.add("oculto");
        return;
    }
    porId("estado-sesion").textContent = "Puedes actualizar tu información y guardar los cambios.";
    formulario.classList.remove("oculto");
    if (botonHeader) botonHeader.classList.remove("oculto");
    if (botonDatos) botonDatos.classList.remove("oculto");
    porId("datos-nombre").value = clienteActual.nombre;
    porId("datos-correo").value = clienteActual.correo;
    porId("datos-direccion").value = clienteActual.direccionEnvio;
    porId("datos-usuario").value = clienteActual.usuario;
    porId("datos-clave").value = clienteActual.contraseña;
}

porId("form-datos").addEventListener("submit", evento => {
    evento.preventDefault();
    if (!clienteActual) return;
    const nuevoUsuario = porId("datos-usuario").value.trim();
    const usuarioDuplicado = clientes.some(cliente => cliente !== clienteActual && cliente.usuario === nuevoUsuario);
    if (usuarioDuplicado) {
        mensaje("mensaje-datos", "Ese nombre de usuario ya lo utiliza otra persona.", true);
        return;
    }
    clienteActual.modificarDatos(
        porId("datos-nombre").value.trim(),
        porId("datos-correo").value.trim(),
        porId("datos-direccion").value.trim(),
        nuevoUsuario,
        porId("datos-clave").value
    );
    guardarClientes();
    guardarSesion();
    mensaje("mensaje-datos", "Tus datos fueron actualizados.");
});

porId("cerrar-sesion").addEventListener("click", cerrarSesion);

// Los botones del catálogo y del carrito se gestionan con clics.
document.addEventListener("click", evento => {
    const boton = evento.target.closest("button");
    if (!boton) return;

    if (boton.dataset.cerrarSesion) {
        cerrarSesion();
        return;
    }

    if (boton.dataset.vista) {
        mostrarVista(boton.dataset.vista);
    }
    if (boton.dataset.agregar) {
        if (!necesitaSesion()) return;
        const producto = productos.find(item => item.idProducto === Number(boton.dataset.agregar));
        const enCarrito = carrito.listaProductos.find(item => item.producto.idProducto === producto.idProducto);
        if (!enCarrito && producto.stock <= 0) {
            alert("Este producto no tiene unidades disponibles.");
            return;
        }
        if (enCarrito && enCarrito.cantidad >= producto.stock) {
            alert("No hay más unidades disponibles de este producto.");
            return;
        }
        carrito.agregarProducto(producto);
        mostrarCarrito();
        mensaje("mensaje-carrito", `${producto.nombre} se agregó al carrito.`);
    }
    if (boton.dataset.eliminar) {
        carrito.eliminarProducto(Number(boton.dataset.eliminar));
        mostrarCarrito();
    }
    if (boton.dataset.sumar || boton.dataset.restar) {
        const id = Number(boton.dataset.sumar || boton.dataset.restar);
        const item = carrito.listaProductos.find(elemento => elemento.producto.idProducto === id);
        if (item) carrito.actualizarCantidad(id, item.cantidad + (boton.dataset.sumar ? 1 : -1));
        mostrarCarrito();
    }
});

// Confirma la compra, actualiza el stock y muestra la orden.
porId("confirmar-compra").addEventListener("click", () => {
    if (!necesitaSesion()) return;
    if (carrito.listaProductos.length === 0) {
        mensaje("mensaje-carrito", "Agrega al menos un producto antes de confirmar la compra.", true);
        return;
    }

    const orden = new Orden(Date.now(), clienteActual, carrito.listaProductos, carrito.calcularTotal());
    orden.generarOrden();
    orden.listaProductos.forEach(item => item.producto.actualizarStock(item.cantidad));

    const resumen = porId("resumen-orden");
    resumen.innerHTML = `
        <div class="datos-orden">
            <p><strong>Número de orden:</strong> ${orden.numeroOrden}</p>
            <p><strong>Cliente:</strong> ${orden.cliente.nombre}</p>
            <p><strong>Dirección de envío:</strong> ${orden.cliente.direccionEnvio}</p>
            <p><strong>Fecha:</strong> ${orden.fecha.toLocaleString("es-CO")}</p>
            <p><strong>Estado:</strong> ${orden.estado}</p>
        </div>
        <h2>Detalle de productos</h2>
        ${orden.mostrarResumen().map(item => `
            <div class="linea-orden">
                <span>${item.producto.nombre} × ${item.cantidad}</span>
                <strong>${dinero(item.producto.precio * item.cantidad)}</strong>
            </div>`).join("")}
        <div class="resumen-total"><span>Total pagado</span><strong>${dinero(orden.total)}</strong></div>`;

    carrito.listaProductos = [];
    carrito.calcularTotal();
    mostrarCarrito();
    mostrarVista("orden");
});

// Los botones de navegación pueden estar en el encabezado o dentro de una vista.
document.querySelectorAll("[data-vista]").forEach(boton => {
    boton.addEventListener("click", () => mostrarVista(boton.dataset.vista));
});

// Vista inicial.
mostrarVista("inicio");

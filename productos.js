// 
// CLASE PRODUCTO Y SUS CLASES HEREDADAS
// 
class Producto {
    constructor(idProducto, nombre, descripcion, precio, stock, imagen) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;
    }

    mostrarInfo() {
        return this.descripcion;
    }

    actualizarStock(cantidad) {
        this.stock -= cantidad;
    }
}

class Laptop extends Producto {
    constructor(id, nombre, descripcion, precio, stock, imagen, procesador, memoriaRAM, almacenamiento) {
        super(id, nombre, descripcion, precio, stock, imagen);
        this.procesador = procesador;
        this.memoriaRAM = memoriaRAM;
        this.almacenamiento = almacenamiento;
    }

    mostrarInfo() {
        return `${this.descripcion} Procesador: ${this.procesador}, RAM: ${this.memoriaRAM}, almacenamiento: ${this.almacenamiento}.`;
    }
}

class Smartphone extends Producto {
    constructor(id, nombre, descripcion, precio, stock, imagen, sistemaOperativo, tamañoPantalla, camara) {
        super(id, nombre, descripcion, precio, stock, imagen);
        this.sistemaOperativo = sistemaOperativo;
        this.tamañoPantalla = tamañoPantalla;
        this.camara = camara;
    }

    mostrarInfo() {
        return `${this.descripcion} Sistema: ${this.sistemaOperativo}, pantalla: ${this.tamañoPantalla}, cámara: ${this.camara}.`;
    }
}

class Accesorio extends Producto {
    constructor(id, nombre, descripcion, precio, stock, imagen, tipoAccesorio) {
        super(id, nombre, descripcion, precio, stock, imagen);
        this.tipoAccesorio = tipoAccesorio;
    }

    mostrarInfo() {
        return `${this.descripcion} Tipo de accesorio: ${this.tipoAccesorio}.`;
    }
}

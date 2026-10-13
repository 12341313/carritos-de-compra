# Diagrama UML del proyecto TecnoCompra

```mermaid
classDiagram
    class Cliente {
        +nombre: string
        +correo: string
        +direccionEnvio: string
        +usuario: string
        +contraseña: string
        +registrar()
        +iniciarSesion(usuario, contraseña)
        +modificarDatos(nombre, correo, direccionEnvio, usuario, contraseña)
    }

    class Producto {
        +idProducto: number
        +nombre: string
        +descripcion: string
        +precio: number
        +stock: number
        +imagen: string
        +mostrarInfo()
        +actualizarStock(cantidad)
    }

    class Laptop {
        +procesador: string
        +memoriaRAM: string
        +almacenamiento: string
        +mostrarInfo()
    }

    class Smartphone {
        +sistemaOperativo: string
        +tamañoPantalla: string
        +camara: string
        +mostrarInfo()
    }

    class Accesorio {
        +tipoAccesorio: string
        +mostrarInfo()
    }

    class CarritoCompra {
        +listaProductos: array
        +total: number
        +agregarProducto(producto)
        +eliminarProducto(idProducto)
        +actualizarCantidad(idProducto, cantidad)
        +calcularTotal()
    }

    class Orden {
        +numeroOrden: number
        +cliente: Cliente
        +listaProductos: array
        +total: number
        +fecha: Date
        +estado: string
        +generarOrden()
        +mostrarResumen()
    }

    Producto <|-- Laptop
    Producto <|-- Smartphone
    Producto <|-- Accesorio

    Cliente "1" --> "0..*" Orden : realiza
    CarritoCompra "1" --> "0..*" Producto : contiene
    Orden "1" --> "1..*" Producto : incluye
```

## Descripción breve
- `Cliente` representa al usuario registrado del sistema.
- `Producto` es la clase base para todos los artículos del catálogo.
- `Laptop`, `Smartphone` y `Accesorio` heredan de `Producto` y agregan atributos específicos.
- `CarritoCompra` administra los productos agregados y el total a pagar.
- `Orden` representa la compra confirmada con cliente, productos y resumen final.

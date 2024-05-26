document.addEventListener("DOMContentLoaded", function () {
    // Lista de productos en el carrito
    var carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Función para guardar el carrito en localStorage
    function guardarCarrito() {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    // Obtener todos los botones "Agregar al carrito"
    var addToCartButtons = document.querySelectorAll(".agregar-carrito");

    // Función para agregar un producto al carrito
    function agregarAlCarrito(event) {
        // Obtener la información del producto
        var card = event.target.closest(".card");
        var imagen = card.querySelector("img").src;
        var nombre = card.querySelector(".card-text").textContent;
        var precio = card.querySelector("#precio").textContent;

        // Comprobar si el producto ya está en el carrito
        var productoExistente = carrito.find(function (producto) {
            return producto.nombre === nombre;
        });

        if (productoExistente) {
            // Si el producto ya está en el carrito, aumentar la cantidad
            productoExistente.cantidad++;
        } else {
            // Si el producto no está en el carrito, agregarlo
            var producto = {
                imagen: imagen,
                nombre: nombre,
                precio: precio,
                cantidad: 1
            };
            carrito.push(producto);
        }

        // Guardar el carrito en localStorage
        guardarCarrito();

        // Actualizar el contenido del modal del carrito
        actualizarModalCarrito();
    }

    // Agregar un evento de clic a cada botón "Agregar al carrito"
    addToCartButtons.forEach(function (button) {
        button.addEventListener("click", agregarAlCarrito);
    });

    // Función para actualizar el contenido del modal del carrito
    function actualizarModalCarrito() {
        // Obtener el cuerpo del modal y el elemento del total
        var modalBody = document.querySelector("#carrito .modal-body tbody");
        var totalPagarElemento = document.getElementById("total-pagar");
        var pagarButton = document.querySelector("#carrito .modal-footer .btn-success");

        // Limpiar el contenido actual del cuerpo del modal y el total
        modalBody.innerHTML = "";
        totalPagarElemento.textContent = ""; // Limpiar el contenido del total

        if (carrito.length === 0) {
            // Ocultar el botón de "Pagar"
            pagarButton.style.display = "none";
            // Mostrar el mensaje de carrito vacío
            document.getElementById("mensaje-carrito-vacio").style.display = "block";
        } else {
            // Ocultar el mensaje de carrito vacío
            document.getElementById("mensaje-carrito-vacio").style.display = "none";
            // Recorrer la lista de productos en el carrito
            carrito.forEach(function (producto) {
                // Crear una fila para cada producto
                var fila = document.createElement("tr");
                fila.innerHTML = `
                    <td><img src="${producto.imagen}" alt="Producto" width="50"></td>
                    <td>${producto.nombre}</td>
                    <td>$${producto.precio}</td>
                    <td>${producto.cantidad}</td>
                    <td><button class="btn btn-danger eliminar-producto" data-nombre="${producto.nombre}">Eliminar</button></td>
                `;
                // Agregar la fila al cuerpo del modal
                modalBody.appendChild(fila);
            });

            // Agregar un evento de clic a los botones "Eliminar" para eliminar productos del carrito
            var botonesEliminar = document.querySelectorAll(".eliminar-producto");
            botonesEliminar.forEach(function (boton) {
                boton.addEventListener("click", function () {
                    var nombreProducto = boton.getAttribute("data-nombre");
                    eliminarProductoDelCarrito(nombreProducto);
                    // Actualizar el modal después de eliminar un producto
                    actualizarModalCarrito();
                });
            });

            // Mostrar o ocultar el botón de "Pagar" según si hay productos en el carrito
            pagarButton.style.display = "block";
        }

        // Calcular el total a pagar
        var totalPagar = calcularTotalPagar();

        // Mostrar el total a pagar en el modal
        totalPagarElemento.textContent = "$" + totalPagar.toFixed(2); // Mostrar el total con 2 decimales
    }

    // Función para calcular el total a pagar
    function calcularTotalPagar() {
        var total = 0;
        carrito.forEach(function (producto) {
            total += parseFloat(producto.precio) * producto.cantidad;
        });
        return total;
    }

    // Función para eliminar un producto del carrito
    function eliminarProductoDelCarrito(nombreProducto) {
        carrito = carrito.filter(function (producto) {
            return producto.nombre !== nombreProducto;
        });
        // Guardar el carrito en localStorage
        guardarCarrito();
    }

    // Obtener el botón para vaciar el carrito
    var vaciarCarritoButton = document.querySelector("#carrito .modal-footer .btn-danger");

    // Agregar un evento de clic al botón para vaciar el carrito
    vaciarCarritoButton.addEventListener("click", function () {
        carrito = []; // Vaciar el carrito
        guardarCarrito(); // Guardar el carrito vacío en localStorage
        actualizarModalCarrito(); // Actualizar el modal del carrito después de vaciarlo
    });

    // Obtener el botón de "Pagar"
    var pagarButton = document.querySelector("#carrito .modal-footer .btn-success");

    // Agregar un evento de clic al botón de "Pagar"
    pagarButton.addEventListener("click", function () {
        if (carrito.length > 0) {
            // Vaciar el carrito
            carrito = [];
            guardarCarrito(); // Guardar el carrito vacío en localStorage
            // Actualizar el modal del carrito después de vaciarlo
            actualizarModalCarrito();
            // Mostrar un mensaje de "Pago exitoso" dentro del modal
            var mensajePagoExitoso = document.createElement("div");
            mensajePagoExitoso.classList.add("alert", "alert-success");
            mensajePagoExitoso.textContent = "¡Pago exitoso! Gracias por su compra.";
            var modalBody = document.querySelector("#carrito .modal-body");
            modalBody.appendChild(mensajePagoExitoso);
        }
    });

    // Restaurar el contenido del carrito al cargar la página
    actualizarModalCarrito();
});

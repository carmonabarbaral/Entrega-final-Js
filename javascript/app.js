const consultarMaterias = async () => {
	const response = await fetch("./materias.json");
	const materias = await response.json();
	return materias;
};

const materias = consultarMaterias();
const countCarrito = document.querySelector("#countCarrito");
const btnFinalizar = document.querySelector("#btn-finalizar");
const primerGrado = document.querySelector("#primerGrado");
const segundoGrado = document.querySelector("#segundoGrado");
const tercerGrado = document.querySelector("#tercerGrado");
const cuartoGrado = document.querySelector("#cuartoGrado");
const quintoGrado = document.querySelector("#quintoGrado");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const materiasContainer = document.querySelector(".materias__container");

consultarMaterias().then((materias) => {
	materias.forEach((materia) => {
		materiasContainer.innerHTML += `<div class="producto__card" >
    <h3>${materia.nombre}</h3>
    <img src="${materia.img}" />
    <div>
    <p class="curso__price">$${materia.precio}</p>
    <a href='#' class='btn-primary agregar-favorito' id='${materia.id}'>Comprar</a>
    </div>
  </div>`;
	});
	btnComprar(materias);
});

function buscarMateria(grado) {
	materiasContainer.innerHTML = "";
	consultarMaterias().then((materias) => {
		materias = materias.filter((materia) => materia.grado === grado);
		materias.forEach((y) => {
			materiasContainer.innerHTML += `<div class="producto__card" >
      <h3>${y.nombre}...</h3>
      <img src="${y.img}" />
      <div>
      <p class="curso__price">$${y.precio}</p>
      <a href='#' class='btn-primary agregar-favorito' id='${y.id}'>Comprar</a>
      </div>
      
    </div>`;
		});
	});
}

function btnComprar(materias) {
	const btnAgregar = document.querySelectorAll(".agregar-favorito");

	btnAgregar.forEach((btn) => {
		btn.onclick = (e) => {
			e.preventDefault();
			const materiaSeleccionada = materias.find(
				(prod) => prod.id === parseInt(btn.id)
			);
			const productoCarrito = { ...materiaSeleccionada, cantidad: 1 };
			const indexCarrito = carrito.findIndex(
				(prod) => prod.id === productoCarrito.id
			);
			if (indexCarrito === -1) {
				carrito.push(productoCarrito);
			} else {
				carrito[indexCarrito].cantidad++;
			}
			localStorage.setItem("carrito", JSON.stringify(carrito));
			actualizarCarrito();
			imprimirCarrito();
		};
	});
}

function actualizarCarrito() {
	countCarrito.innerHTML = carrito.length;
}

function imprimirCarrito() {
	listaCarrito.innerHTML = "";
	carrito.forEach((item) => {
		listaCarrito.innerHTML += `<li><div><img src="${item.img}" /> ${
			item.nombre
		} x ${item.cantidad}</div> <div>$${
			item.cantidad * item.precio
		}<i class='bx bxs-trash' data-id='${item.id}'></i></div></li>`;
	});
	if (carrito !== []) {
		const btnEliminar = document.querySelectorAll(".bxs-trash");
		btnEliminar.forEach((btn) => {
			btn.onclick = (e) => {
				const productoId = e.target.getAttribute("data-id");
				carrito = carrito.filter((prod) => prod.id != productoId);
				localStorage.setItem("carrito", JSON.stringify(carrito));
				actualizarCarrito();
				imprimirCarrito();
			};
		});
	}
	crearTotal();
}

function crearTotal() {
	sumatotal = 0;
	carrito.forEach((producto) => {
		sumatotal += producto.precio * producto.cantidad;
	});
	const total = document.querySelector("#total");

	sumatotal !== 0 ? carritoLleno() : carritoVacio();
}

function carritoLleno() {
	total.innerHTML = `<span>El total es de $${sumatotal}</span>`;
	btnFinalizar.style.display = "block";
}

function carritoVacio() {
	total.innerHTML = `El carrito esta vacio`;
	btnFinalizar.style.display = "none";
}

function finalizarCompra() {
	swal(
		"Compra realizada con exito",
		"Recibirá los datos de la compra por mail",
		"success"
	);
	carrito = [];
	localStorage.setItem("carrito", JSON.stringify(carrito));
	actualizarCarrito();
	imprimirCarrito();
	carritoVacio();
}

btnFinalizar.addEventListener("click", finalizarCompra);

actualizarCarrito();
imprimirCarrito();

primerGrado.addEventListener("click", () => buscarMateria("primero"));
segundoGrado.addEventListener("click", () => buscarMateria("segundo"));
tercerGrado.addEventListener("click", () => buscarMateria("tercero"));
cuartoGrado.addEventListener("click", () => buscarMateria("cuarto"));
quintoGrado.addEventListener("click", () => {
	buscarMateria("quinto");
});

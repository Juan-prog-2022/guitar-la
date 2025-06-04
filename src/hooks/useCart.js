import { useState, useEffect, useMemo} from "react";
import { db } from "../data/db";

export const useCart = () => {
  const initialCart = () => {
    // Cargar el carrito desde localStorage si existe, sino retornar un array vacio
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  // State
  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MIN_ITEMS = 1;
  const MAX_ITEMS = 5;

  // useEffect para cargar los datos desde la base de datos
  useEffect(() => {
    // Cargar datos desde la base de datos
    // En este caso, estamos usando una base de datos local simulada
    // En una aplicacion real, aqui se haria una peticion a una API para obtener los datos
    // y luego se setearian los datos en el state
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // function addToCart
  // esta funcion se encarga de agregar un item al carrito
  function addToCart(item) {
    // revisar si el producto ya existe en el carrito
    const itemExists = cart.findIndex(guitar => guitar.id === item.id);

    if (itemExists >= 0) {
      // existe en el carrito
      // si existe, aumentar la cantidad
      if (cart[itemExists].quantity >= MAX_ITEMS) return;
      // creo una copia de mi carrito para poder setear y actualizar el estado para no romper las reglas de react (el state no se puede mutar)
      // el spread operator me permite copiar el array y agregarle un nuevo elemento
      // en este caso, el nuevo elemento es el mismo elemento que ya existe pero con la cantidad aumentada
      // el item que existe en el carrito es el que tiene el mismo id que el item que estoy agregando
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity++;
      // actualizo el estado
      setCart(updatedCart);
    } else {
      // si no existe, agregar al carrito
      item.quantity = 1;
      setCart([...cart, item]);
      console.log("Agregado al carrito");
    }
  }

  // function removeFromCart
  // esta funcion se encarga de eliminar un item del carrito
  function removeFromCart(id) {
    // filtrar el carrito para eliminar el item que tiene el id que le paso
    // el filter me devuelve un nuevo array con los elementos que cumplen la condicion
    // en este caso, la condicion es que el id del item sea diferente al id que le paso
    // el filter no muta el array original, sino que devuelve un nuevo array
    // por lo tanto, no necesito hacer una copia del carrito
    // y puedo setear el carrito directamente con el nuevo array
    // el nuevo array es el carrito original menos el item que quiero eliminar
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
  }

  // function decreaseQuantity
  // esta funcion se encarga de disminuir la cantidad de un item en el carrito
  // la cantidad se disminuye cuando el usuario hace click en el boton de disminuir cantidad
  function decreaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        // si el id del item es igual al id que le paso y la cantidad es mayor a 1
        // si el id del item es igual al id que le paso, disminuir la cantidad
        return {
          // el spread operator me permite copiar el objeto y agregarle un nuevo elemento
          ...item,
          quantity: item.quantity - 1,
        };
      }
      // si el id del item no es igual al id que le paso, devolver el item sin modificar
      return item;
    });
    // setear el carrito con el nuevo array
    setCart(updatedCart);
  }

  // function increaseQuantity
  // esta funcion se encarga de aumentar la cantidad de un item en el carrito
  // la cantidad se aumenta cuando el usuario hace click en el boton de aumentar cantidad
  function increaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        // si el id del item es igual al id que le paso, aumentar la cantidad
        return {
          // el spread operator me permite copiar el objeto y agregarle un nuevo elemento
          ...item,
          quantity: item.quantity + 1,
        };
      }
      // si el id del item no es igual al id que le paso, devolver el item sin modificar
      return item;
    });
    // setear el carrito con el nuevo array
    setCart(updatedCart);
  }

  // function clearCart
  // esta funcion se encarga de limpiar el carrito
  function clearCart() {
    // setear el carrito a un array vacio
    setCart([]);
  }

  // state derivado del cart
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  // calcular el total del carrito con state derivado
  // usamos useMemo para evitar que se recalculen los valores cada vez que se renderiza el componente
  // y solo se recalculen cuando el cart cambie
  // el total se calcula multiplicando la cantidad de cada item por su precio
  const cartTotal = useMemo(
    () => cart.reduce((total, guitar) => total + (guitar.quantity * guitar.price), 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isEmpty,
    cartTotal
  };
};

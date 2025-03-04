import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@components/client/Button';
import Input from '@components/client/Input';
import { Table } from '@components/client/Table';
import { TableHeader } from '@components/client/TableHeader';
import { TableBody } from '@components/client/TableBody';
import { TableRow } from '@components/client/TableRow';
import { TableCell } from '@components/client/TableCell';
import { OrderItem } from '@interfaces/client/OrderTypes';
import IngredientModal from '@components/client/IngredientModal';
import { Ingredient } from '@interfaces/client/IngredientTypes';
import styles from './styles.module.css';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface Restaurant {
  nombre: string;
}

const CrearOrden = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { supplier } = (location.state as { supplier?: Restaurant }) || {};

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const total = orderItems.reduce((sum, item) => sum + item.precio, 0);

  const handleClearOrder = () => {
    setOrderItems([]);
  };

  const handleSendOrder = async () => {
    const ingredientesPayload = orderItems.map(item => ({
      ingredientID: item.id,
      cantidad: item.cantidad,
    }));
  
    const orderData = {
      orderID: `O${Math.floor(Math.random() * 1000000)}`, 
      orderType: "Urgent",
      fechaOrden: new Date().toISOString().split('T')[0],
      estado: "Pendiente",
      restaurantName: supplier ? supplier.nombre : "Default Restaurant",
      ingredientes: ingredientesPayload,
    };
  
    try {
      const response = await axios.post(`${API_URL}/orders`, orderData);
      navigate('/user/summary-order', { 
        state: { 
          ...response.data, 
          restaurantName: orderData.restaurantName 
        } 
      });
    } catch (error) {
      console.error("Error al enviar la orden:", error);
    }
  };
  

  useEffect(() => {
    const savedIngredients = localStorage.getItem('ingredientsList');
    if (savedIngredients) {
      setIngredients(JSON.parse(savedIngredients));
    } else {
      axios.get(`${API_URL}/ingredients`)
        .then(response => {
          const mappedIngredients: Ingredient[] = response.data.map((item: any) => ({
            id: item.id,
            nombre: item.nombre,
            precio: item.precio,
            categoria: item["categoría"],
            caducidad: new Date(item.fecha_caducidad).toLocaleDateString(),
            existencia: item.cantidad_en_existencia,
          }));
          setIngredients(mappedIngredients);
          localStorage.setItem('ingredientsList', JSON.stringify(mappedIngredients));
        })
        .catch(error => console.error("Error cargando ingredientes:", error));
    }
  }, []);

  const handleSuggestionSelect = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setModalVisible(true);
  };

  const handleAddIngredient = (cantidadDeseada: number) => {
    if (!selectedIngredient) return;

    console.log('Agregando ingrediente:', selectedIngredient.nombre, selectedIngredient.precio, selectedIngredient.caducidad, cantidadDeseada);

    const newItem: OrderItem = {
      id: selectedIngredient.id,
      ingrediente: selectedIngredient.nombre,
      caducidad: selectedIngredient.caducidad,
      cantidad: cantidadDeseada,
      precio: selectedIngredient.precio * cantidadDeseada,
    };
    setOrderItems(prev => [...prev, newItem]);
  };

  return (
    <div className={styles.pageContainer}>
      <header className={`${styles.header} ${styles.flexSpace}`}>
        <div>
          <h1>GREAT CHAIN</h1>
          {supplier && <p>Restaurante: {supplier.nombre}</p>}
        </div>
        <div className={styles.logo}>BS</div>
      </header>
      <main className={styles.main}>
        <Input 
          className={styles.searchInput} 
          placeholder="Buscar producto o ingrediente" 
          suggestions={ingredients}
          onSelectSuggestion={handleSuggestionSelect}
        />
        <div className={styles.contentFlex}>
          <div className={styles.actions}>
            {/* Se reemplaza el Link por un botón que llama a handleSendOrder */}
            <Button onClick={handleSendOrder}>Enviar orden</Button>
            <Button variant="outline" onClick={handleClearOrder}>
              Limpiar orden
            </Button>
            <Link to="/user">
              <Button variant="outline">Cancelar orden</Button>
            </Link>
          </div>
          <div className={styles.tableContainer}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell header>Ingrediente</TableCell>
                  <TableCell header>Caducidad</TableCell>
                  <TableCell header>Cantidad</TableCell>
                  <TableCell header align="right">Precio</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.length > 0 ? (
                  orderItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.ingrediente}</TableCell>
                      <TableCell>{item.caducidad}</TableCell>
                      <TableCell>{item.cantidad}</TableCell>
                      <TableCell align="right">${item.precio.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No hay ingredientes en la orden
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell colSpan={3} align="right" className={styles.fontBold}>
                    Total
                  </TableCell>
                  <TableCell align="right" className={styles.fontBold}>
                    ${total.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      {modalVisible && selectedIngredient && (
        <IngredientModal 
          ingredient={selectedIngredient} 
          onAdd={handleAddIngredient}
          onClose={() => setModalVisible(false)}
        />
      )}
    </div>
  );
};

export default CrearOrden;

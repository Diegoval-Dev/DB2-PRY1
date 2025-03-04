import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Button from '@components/client/Button';
import { Table } from '@components/client/Table';
import { TableHeader } from '@components/client/TableHeader';
import { TableBody } from '@components/client/TableBody';
import { TableRow } from '@components/client/TableRow';
import { TableCell } from '@components/client/TableCell';
import styles from './styles.module.css';

const API_URL = import.meta.env.VITE_API_URL;

interface Order {
  orderID: string;
  fecha: string;
  cantidad: number;
  estado: string;
  costoTotal: number;
  restaurantName: string;
}

const Ordenes = () => {
  const location = useLocation();
  const { supplier } = (location.state as { supplier?: { nombre: string } }) || {};
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (supplier && supplier.nombre) {
      axios
        .post(`${API_URL}/orders/restaurant`, {
          restaurantName: supplier.nombre
        })
        .then(response => {
          setOrders(response.data);
        })
        .catch(error => {
          console.error('Error al obtener las órdenes:', error);
        });
    }
  }, [supplier]);

  return (
    <div className={styles.pageContainer}>
      <header className={`${styles.header} ${styles.flexSpace}`}>
        <h1>GREAT CHAIN</h1>
        <div className={styles.logo}>BS</div>
      </header>
      <main className={styles.main}>
        <h2>Órdenes</h2>
        <div className={styles.contentFlex}>
          <div className={styles.tableContainer}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell header>ID</TableCell>
                  <TableCell header>Fecha</TableCell>
                  <TableCell header>Cantidad</TableCell>
                  <TableCell header>Estado</TableCell>
                  <TableCell header align="right">Costo (total)</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map(order => (
                    <TableRow key={order.orderID}>
                      <TableCell>{order.orderID}</TableCell>
                      <TableCell>{order.fecha}</TableCell>
                      <TableCell>{order.cantidad}</TableCell>
                      <TableCell>{order.estado}</TableCell>
                      <TableCell align="right">
                        ${order.costoTotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No hay órdenes disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className={styles.actionsVertical}>
            {/* 
              Al crear una nueva orden, 
              podríamos querer mantener el mismo restaurante, 
              así que le pasamos "supplier" como state si lo deseas.
            */}
            <Link to="/user/create-order" state={{ supplier }}>
              <Button>Nueva orden</Button>
            </Link>
            <Button variant="outline">Filtrar</Button>
            <Link to="/user">
              <Button variant="outline">Salir</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Ordenes;

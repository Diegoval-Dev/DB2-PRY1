import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '@components/client/Button'
import { Table } from '@components/client/Table'
import { TableHeader } from '@components/client/TableHeader'
import { TableBody } from '@components/client/TableBody'
import { TableRow } from '@components/client/TableRow'
import { TableCell } from '@components/client/TableCell'
import styles from './styles.module.css'

const ResumenOrden = () => {
  const location = useLocation();
  const orderData = location.state;

  if (!orderData) {
    return (
      <div className={styles.pageContainer}>
        <h2>No se encontró información de la orden.</h2>
        <Link to="/user/create-order">
          <Button>Nueva orden</Button>
        </Link>
      </div>
    );
  }

  // Extraemos restaurantName junto con el resto de la data
  const { orderID, orderType, fechaOrden, estado, destinoID, costoTotal, detalles, restaurantName } = orderData;

  return (
    <div className={styles.pageContainer}>
      <header className={`${styles.header} ${styles.flexSpace}`}>
        <h1>GREAT CHAIN</h1>
        <div className={styles.logo}>BS</div>
      </header>
      <main className={styles.main}>
        <h2>Resumen de orden de compra</h2>
        <div className={styles.orderInfo}>
          <p><strong>Orden ID:</strong> {orderID}</p>
          <p><strong>Tipo:</strong> {orderType}</p>
          <p><strong>Fecha:</strong> {fechaOrden}</p>
          <p><strong>Estado:</strong> {estado}</p>
          <p><strong>Restaurante:</strong> {restaurantName}</p>
          <p><strong>Destino (Inventario):</strong> {destinoID}</p>
        </div>
        <div className={styles.contentFlex}>
          <div className={styles.tableContainer}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell header>Ingrediente</TableCell>
                  <TableCell header>Proveedor</TableCell>
                  <TableCell header>Caducidad</TableCell>
                  <TableCell header>Cantidad</TableCell>
                  <TableCell header align="right">Precio</TableCell>
                  <TableCell header align="right">Subtotal</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detalles && detalles.length > 0 ? (
                  detalles.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.ingrediente}</TableCell>
                      <TableCell>{item.proveedor}</TableCell>
                      <TableCell>{item.caducidad}</TableCell>
                      <TableCell>{item.cantidad}</TableCell>
                      <TableCell align="right">${Number(item.precio).toFixed(2)}</TableCell>
                      <TableCell align="right">${Number(item.subtotal).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No hay detalles de la orden
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell colSpan={5} align="right" className={styles.fontBold}>
                    Total
                  </TableCell>
                  <TableCell align="right" className={styles.fontBold}>
                    ${Number(costoTotal).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className={styles.actionsVertical}>
          <Link to="/user/orders" state={{ supplier: { nombre: restaurantName } }}>
            <Button>Continuar</Button>
          </Link>

            {/* Al navegar a "Nueva orden" se pasa de nuevo el supplier (o restaurantName) */}
            <Link to="/user/create-order" state={{ supplier: { nombre: restaurantName } }}>
              <Button variant="outline">Nueva orden</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumenOrden;

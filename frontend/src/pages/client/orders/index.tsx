import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@components/client/Button'
import { Table } from '@components/client/Table'
import { TableHeader } from '@components/client/TableHeader'
import { TableBody } from '@components/client/TableBody'
import { TableRow } from '@components/client/TableRow'
import { TableCell } from '@components/client/TableCell'
import styles from './styles.module.css'

const Ordenes = () => {
  const orders = [
    { id: 'ORD-001', fecha: '25/02/2025', cantidad: 8, estado: 'Entregado', costo: 40.0 },
    { id: 'ORD-002', fecha: '26/02/2025', cantidad: 5, estado: 'En proceso', costo: 35.0 },
    { id: 'ORD-003', fecha: '27/02/2025', cantidad: 12, estado: 'Pendiente', costo: 75.0 },
  ]

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
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.fecha}</TableCell>
                      <TableCell>{order.cantidad}</TableCell>
                      <TableCell>{order.estado}</TableCell>
                      <TableCell align="right">${order.costo.toFixed(2)}</TableCell>
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
            <Link to="/user/create-order">
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
  )
}

export default Ordenes

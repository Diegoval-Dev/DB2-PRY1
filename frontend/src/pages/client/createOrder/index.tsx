import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@components/client/Button'
import Input from '@components/client/Input'
import { Table } from '@components/client/Table'
import { TableHeader } from '@components/client/TableHeader'
import { TableBody } from '@components/client/TableBody'
import { TableRow } from '@components/client/TableRow'
import { TableCell } from '@components/client/TableCell'
import { OrderItem } from '@interfaces/client/OrderTypes'
import styles from './styles.module.css'

const CrearOrden = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: 1, ingrediente: 'Tomates', caducidad: '10/03/2025', cantidad: 5, precio: 25.0 },
    { id: 2, ingrediente: 'Cebollas', caducidad: '15/03/2025', cantidad: 3, precio: 15.0 },
  ])

  const total = orderItems.reduce((sum, item) => sum + item.precio, 0)

  const handleClearOrder = () => {
    setOrderItems([])
  }

  return (
    <div className={styles.pageContainer}>
      <header className={`${styles.header} ${styles.flexSpace}`}>
        <h1>GREAT CHAIN</h1>
        <div className={styles.logo}>BS</div>
      </header>
      <main className={styles.main}>
        <Input className={styles.searchInput} placeholder="Buscar producto o ingrediente" />
        <div className={styles.contentFlex}>
          <div className={styles.actions}>
            <Link to="/user/summary-order">
              <Button>Enviar orden</Button>
            </Link>
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
                  <TableCell align="right" className={styles.fontBold}>${total.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CrearOrden

import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@components/client/Button'
import { Table } from '@components/client/Table'
import { TableHeader } from '@components/client/TableHeader'
import { TableBody } from '@components/client/TableBody'
import { TableRow } from '@components/client/TableRow'
import { TableCell } from '@components/client/TableCell'
import styles from './styles.module.css' // Importar CSS Modules

const ResumenOrden = () => {
  const orderItems = [
    {
      id: 1,
      ingrediente: 'Tomates',
      proveedor: 'Agrícola del Sur',
      caducidad: '10/03/2025',
      cantidad: 5,
      precio: 25.0
    },
    {
      id: 2,
      ingrediente: 'Cebollas',
      proveedor: 'Verduras Express',
      caducidad: '15/03/2025',
      cantidad: 3,
      precio: 15.0
    }
  ]

  const total = orderItems.reduce((sum, item) => sum + item.precio, 0)

  return (
    <div className={styles.pageContainer}>
      <header className={`${styles.header} ${styles.flexSpace}`}>
        <h1>GREAT CHAIN</h1>
        <div className={styles.logo}>BS</div>
      </header>
      <main className={styles.main}>
        <h2>Resumen de orden de compra</h2>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.ingrediente}</TableCell>
                    <TableCell>{item.proveedor}</TableCell>
                    <TableCell>{item.caducidad}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell align="right">${item.precio.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} align="right" className={styles.fontBold}>
                    Total
                  </TableCell>
                  <TableCell align="right" className={styles.fontBold}>${total.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className={styles.actionsVertical}>
            <Link to="/user/orders">
              <Button>Continuar</Button>
            </Link>
            <Link to="/user/create-order">
              <Button variant="outline">Nueva orden</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ResumenOrden

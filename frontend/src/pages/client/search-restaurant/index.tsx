import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@components/client/Button'
import Input from '@components/client/Input'
import styles from './styles.module.css' 

const Home = () => {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>GREAT CHAIN</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.card}>
          <Input className={styles.input} placeholder="Ingrese el nombre del restaurante" />
          <div className={styles.buttonGroup}>
            <Link to="/user/create-order">
              <Button>Ingresar orden</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

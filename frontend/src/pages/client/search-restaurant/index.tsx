import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/client/Button';
import Input from '@components/client/Input';
import styles from './styles.module.css';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/location`)
      .then(response => setSuppliers(response.data))
      .catch(error => console.error("Error cargando proveedores:", error));
  }, []);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>GREAT CHAIN</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.card}>
          <Input 
            className={styles.input} 
            placeholder="Ingrese el nombre del restaurante"
            suggestions={suppliers} 
          />
          <div className={styles.buttonGroup}>
            <Link to="/user/create-order">
              <Button>Ingresar orden</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

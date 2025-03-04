import React, { useState } from 'react';
import Modal from './Modal';
import Button from '@components/client/Button';
import styles from './styles/IngredientModal.module.css';

interface Ingredient {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  caducidad: string;
  existencia: number;
}

interface IngredientModalProps {
  ingredient: Ingredient;
  onAdd: (cantidad: number) => void;
  onClose: () => void;
}

const IngredientModal: React.FC<IngredientModalProps> = ({ ingredient, onAdd, onClose }) => {
  const [cantidad, setCantidad] = useState<number>(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setCantidad(isNaN(value) ? 0 : value);
  };

  return (
    <Modal onClose={onClose}>
      <div className={styles.container}>
        <h2>{ingredient.nombre}</h2>
        <p>Precio: ${ingredient.precio.toFixed(2)}</p>
        <p>Categoría: {ingredient.categoria}</p>
        <p>Caducidad: {ingredient.caducidad}</p>
        <p>Existencia: {ingredient.existencia}</p>
        <input 
          type="number"
          value={cantidad}
          onChange={handleChange}
          placeholder="Cantidad deseada"
          className={styles.input}
        />
        <div className={styles.actions}>
          <Button onClick={() => { onAdd(cantidad); onClose(); }}>Agregar</Button>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </Modal>
  );
};

export default IngredientModal;

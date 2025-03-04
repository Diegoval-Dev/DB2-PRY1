import React from 'react';
import styles from './styles/Modal.module.css';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={stopPropagation}>
        {children}
      </div>
    </div>
  );
};

export default Modal;

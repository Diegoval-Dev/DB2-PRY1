import React from 'react';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Great Chain</h1>
          <p className={styles.subtitle}>Sistema Integral de Gestión de Cadena de Suministro</p>
          <button className={styles.ctaButton}>Comenzar</button>
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Nuestras Soluciones</h2>
        <div className={styles.featureCards}>
          <div className={styles.featureCard}>
            <div className={styles.iconContainer}>📦</div>
            <h3>Gestión de Inventario</h3>
            <p>Control preciso de productos en tiempo real con alertas automáticas de reposición.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconContainer}>🚚</div>
            <h3>Logística y Distribución</h3>
            <p>Optimización de rutas y seguimiento de envíos para entregas eficientes.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.iconContainer}>📊</div>
            <h3>Análisis y Reportes</h3>
            <p>Informes detallados para tomar decisiones basadas en datos actualizados.</p>
          </div>
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          <h2 className={styles.sectionTitle}>Acerca de Great Chain</h2>
          <p className={styles.aboutText}>
            Great Chain ofrece soluciones integrales para optimizar todos los aspectos 
            de su cadena de suministro. Nuestro sistema conecta proveedores, 
            producción, almacenamiento y distribución en una plataforma unificada.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2023 Great Chain - Sistema de Cadena de Suministro</p>
      </footer>
    </div>
  );
};

export default Home;

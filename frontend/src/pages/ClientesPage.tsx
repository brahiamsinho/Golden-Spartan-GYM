import React from 'react';
import ClientesList from '../components/clientes/ClientesList';
import styles from './ClientesPage.module.css';

const ClientesPage: React.FC = () => {
  return (
    <div className={styles.clientesPage}>
      <div className={styles.container}>
        <ClientesList />
      </div>
    </div>
  );
};

export default ClientesPage;
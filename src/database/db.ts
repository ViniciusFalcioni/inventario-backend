import sqlite3 from 'sqlite3';
sqlite3.verbose();

const db = new sqlite3.Database('./inventario.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');
    }
});

export default db;

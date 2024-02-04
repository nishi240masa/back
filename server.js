const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 3004; // 適切なポートに変更

const cors = require('cors');
app.use(cors());

// PostgreSQLデータベースの接続情報
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || process.env.DB_,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client.connect();

client.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL:', res.rows[0]);
  }
});

client.query(
  'CCREATE TABLE income (id SERIAL PRIMARY KEY,date DATE,amount DECIMAL(10, 2))',
  (err, res) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Created table:', res);
    }
  }
);

// Body parser middleware
app.use(bodyParser.json());

// APIエンドポイントの設定
app.post('/api/income', async (req, res) => {
  try {
    const { date, income } = req.body;

    // PostgreSQLデータベースにデータを保存
    const result = await client.query(
      'INSERT INTO income (date, amount) VALUES ($1, $2) RETURNING *',
      [date, income]
    );

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error saving income:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// サーバーの起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

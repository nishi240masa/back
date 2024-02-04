const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 3001; // 適切なポートに変更

// PostgreSQLデータベースの接続情報
const client = new Client({
  user: 'your_postgres_user',
  host: 'localhost',
  database: 'your_database_name',
  password: 'your_password',
  port: 5432, // ポート番号は適宜変更
});
client.connect();

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

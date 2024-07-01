import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// __filename ve __dirname için çözümler
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// JSON gövdeleri çözümlemek için middleware ekleyin
app.use(express.json());

// Public klasöründeki dosyaları sunmak için statik dosya servisini ekleyin
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/api/calculate', (req: Request, res: Response) => {
  const { firstOperand, secondOperand, operation } = req.body;

  let result:number;
  switch (operation) {
    case '+':
      result = parseFloat(firstOperand) + parseFloat(secondOperand);
      break;
    case '-':
      result = parseFloat(firstOperand) - parseFloat(secondOperand);
      break;
    case '*':
      result = parseFloat(firstOperand) * parseFloat(secondOperand);
      break;
    case '/':
      result = parseFloat(firstOperand) / parseFloat(secondOperand);
      break;
    default:
      return res.status(400).send({ error: 'Invalid operation' });
  }

  const historyEntry = { operation: `${firstOperand} ${operation} ${secondOperand}`, result };
  fs.readFile('src/history.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading history file:', err);
      return res.status(500).send({ error: 'Internal server error' });
    }

    const history = JSON.parse(data);
    history.push(historyEntry);

    fs.writeFile('src/history.json', JSON.stringify(history), 'utf8', (err) => {
      if (err) {
        console.error('Error writing history file:', err);
        return res.status(500).send({ error: 'Internal server error' });
      }

      res.send({ result });
    });
  });
});

app.get('/api/history', (req: Request, res: Response) => {
  fs.readFile('src/history.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading history file:', err);
      return res.status(500).send({ error: 'Internal server error' });
    }

    const history = JSON.parse(data);
    res.send(history);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// __filename ve __dirname için çözümler
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Public klasöründeki dosyaları sunmak için statik dosya servisini ekledim
app.use(express.static(path.join(__dirname, '../public')));


app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


app.post('/api/calculate', (req: Request, res: Response) => {
  const { firstOperand, secondOperand, operation } = req.body;

  let result: number;
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
      return res.status(400).send('Invalid operation');
  }

  res.json({ result });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

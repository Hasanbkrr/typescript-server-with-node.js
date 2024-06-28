import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// __filename ve __dirname için çözümler
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
// Public klasöründeki dosyaları sunmak için statik dosya servisini ekleyin
app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

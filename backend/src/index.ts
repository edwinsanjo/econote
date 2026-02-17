
import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express & TypeScript!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

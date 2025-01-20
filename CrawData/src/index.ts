import dotenv from 'dotenv';
import express, { Express } from 'express';
import movieRoutes from './routes/movieRoutes';

dotenv.config();


const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/movies', movieRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

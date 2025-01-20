import dotenv from 'dotenv';
import express, { Express } from 'express';
import movieRoutes from './routes/movieRoutes';
import connectDatabase from './config/database';
import { corsMiddleware } from './middleware/cors';
import cors from 'cors';
import morgan from 'morgan';
import movieDetailCrawlerJob from './cronJob/movieDetailCrawlerJob';

dotenv.config();

const app: Express = express();


//middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(corsMiddleware);
app.use(express.json());

//routes
app.use('/api/movies', movieRoutes);
app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Craw Data</title>
      </head>
      <body style="margin: 0; padding: 0; background: white;">
      </body>
    </html>
  `);
});



// connect database and start server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
	console.log('\x1b[30;1;42m Info \x1b[0m', 'Local:', `\x1b[96m http://localhost:${port} \x1b[0m `);
	await connectDatabase();
	movieDetailCrawlerJob.initJob();
});

export default app;

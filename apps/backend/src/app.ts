import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes/index';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);
app.use(errorHandler);

export default app;
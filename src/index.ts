import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { corsConfig, db, helmetConfig, ENV } from '@config';
import { defaultErrorHandler } from '@middlewares';
import { RegisterRoutes } from '@routes';

import swaggerDocument from '../docs/swagger.json';

const app = express();

app.use(cors(corsConfig));
app.use(helmet(helmetConfig));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

app.get('/ping', async (req: Request, res: Response, next) => {
  try {
    const [rows] = await db.raw('SELECT NOW() as now');
    res.json({ status: 'ok', time: (rows as any)[0].now });
  } catch (err) {
    next(err);
  }
});
app.get('/swagger.json', (req: Request, res: Response) => {
  res.json(swaggerDocument);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

RegisterRoutes(app);
app.use(defaultErrorHandler);

const PORT = ENV.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  db.raw('SELECT 1')
    .then(() => {
      console.log('Database connected');
    })
    .catch((err) => {
      console.error('Database connection error:', err);
    });
});

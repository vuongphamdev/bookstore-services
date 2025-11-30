import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import { authRouter, productRouter, orderRouter, reportRouter, roleRouter, shopRouter, userRouter } from './routes';
import { corsConfig, db, helmetConfig } from '@config';
import { defaultErrorHandler } from '@middleware';
import cors from 'cors';

const swaggerDocument = YAML.load(__dirname + '/../swagger.yaml');

if (swaggerDocument && swaggerDocument.servers && swaggerDocument.servers.length > 0) {
  swaggerDocument.servers[0].url = ENV.SERVER_URL;
}

const app = express();

app.use(cors(corsConfig));
app.use(helmet(helmetConfig));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// test DB
app.get('/ping', async (req: Request, res: Response, next) => {
  try {
    const [rows] = await db.raw('SELECT NOW() as now');
    res.json({ status: 'ok', time: (rows as any)[0].now });
  } catch (err) {
    next(err);
  }
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.use('/', authRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/roles', roleRouter);
app.use('/shops', shopRouter);
app.use('/reports', reportRouter);

// Error handling middleware
app.use(defaultErrorHandler);

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  //check database connection
  db.raw('SELECT 1')
    .then(() => {
      console.log('Database connected');
    })
    .catch((err) => {
      console.error('Database connection error:', err);
    });
});

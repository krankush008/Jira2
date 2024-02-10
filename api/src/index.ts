import 'module-alias/register';
import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

//import createDatabaseConnection from 'database/createConnection';
import { addRespondToResponse } from 'middleware/response';
import { authenticateUser } from 'middleware/authentication';
import { handleError } from 'middleware/errors';
import { RouteNotFoundError } from 'errors';

import { attachPublicRoutes, attachPrivateRoutes } from './routes';

/*
const establishDatabaseConnection = async (): Promise<void> => {
  try {
    await createDatabaseConnection();
  } catch (error) {
    console.log(error);
  }
};
*/
const initializeExpress = () => {
  console.log('popopopoooooooo');
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(cors());

  app.use(addRespondToResponse);

  attachPublicRoutes(app);

  app.use('/', authenticateUser);

  attachPrivateRoutes(app);
  console.log('hbhbhbhbhbhh');

  app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
  app.use(handleError);
  app.listen(process.env.PORT || 3000, function() {
    console.log('Server is running on port ' + 3000);
  });
};

const initializeApp = async (): Promise<void> => {
  ///////////////////////////////////////////FIX the data base connection and then work because of some problem there the initializeExpress() is not running. Comment the below line(database) and then debugg
  // await establishDatabaseConnection();
  initializeExpress();
};

initializeApp();

import { resolve } from 'path';
import helmet from 'helmet';
import swig from 'swig-templates';
import Factory from '../dist';
import ServerError from '../dist/middleware/server-error';
import NotFoundError from '../dist/middleware/not-found-error';
import AppModule from './modules/app.module';

const port = process.env.PORT || 8080;

const { app } = Factory.setViewEngine('html', swig.renderFile)
  .setViewDir(resolve(process.cwd(), 'example/views'))
  .applyMiddlewares(helmet())
  .create(AppModule)
  .applyMiddlewares(ServerError(), NotFoundError());

export { app };

const bootstrap = () => {
  app.listen(port, () => {
    console.log(`Server is serving on port ${port}...`);
  });
};

bootstrap();

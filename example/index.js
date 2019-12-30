import { resolve } from 'path';
import helmet from 'helmet';
import swig from 'swig-templates';
import Factory from '../dist';
import ServerError from '../dist/middleware/server-error';
import NotFoundError from '../dist/middleware/not-found-error';
import AppModule from './modules/app.module';

const port = process.env.PORT || 8080;

export const bootstrap = async () => {
  const instance = await Factory.setViewEngine('html', swig.renderFile)
    .setViewDir(resolve(process.cwd(), 'example/views'))
    .applyMiddlewares(helmet())
    .create(AppModule);

  const { app } = instance.applyMiddlewares(ServerError(), NotFoundError());

  return app;
};

(async () => {
  const app = await bootstrap();

  await app.listen(port);

  console.log(`Server is serving on port ${port}...`);
})();

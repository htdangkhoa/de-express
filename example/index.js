import { resolve, extname } from 'path';
import helmet from 'helmet';
import swig from 'swig-templates';
import Multer from 'multer';
import Factory from '../dist';
import ServerError from '../dist/middleware/server-error';
import NotFoundError from '../dist/middleware/not-found-error';
import AppModule from './modules/app.module';

const port = process.env.PORT || 8080;

const acceptedExtensions = ['jpg', 'jpeg', 'png'];

const storage = Multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, resolve(process.cwd(), 'example/images'));
  },
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}${extname(file.originalname)}`);
  },
});

export const bootstrap = async () => {
  const instance = await Factory.setViewEngine('html', swig.renderFile)
    .setViewDir(resolve(process.cwd(), 'example/views'))
    .applyMiddlewares(helmet())
    .create({
      module: AppModule,
      multer: {
        storage,
        fileFilter: (req, file, next) => {
          if (acceptedExtensions.some((ext) => file.mimetype.includes(ext))) {
            return next(null, true);
          }

          return next(
            new Error(
              `Only ${acceptedExtensions.join(', ')} files are allowed.`,
            ),
          );
        },
      },
    });

  const { app } = instance.applyMiddlewares(ServerError(), NotFoundError());

  return app;
};

(async () => {
  const app = await bootstrap();

  await app.listen(port);

  console.log(`Server is serving on port ${port}...`);
})();

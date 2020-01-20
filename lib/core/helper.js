import 'reflect-metadata';
import compact from 'lodash.compact';
import isEqual from 'lodash.isequal';
import {
  REQUEST_METHOD,
  REQUEST_PATH,
  URL_REDIRECT,
  HEADER,
  STATUS_CODE,
  RENDER_VIEW,
  CONTROLLER_PREFIX,
  CONTROLLER_MIDDLEWARES,
  MODULE,
  INTERCEPTOR,
  MULTER_OPTIONS,
  MIDDLEWARES,
  DEPENDENCIES,
} from './constant';

export const MulterStrategy = Object.freeze({
  SINGLE: 'SINGLE',
  ARRAY: 'ARRAY',
  OBJECT: 'OBJECT',
});

export const last = (array) => {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
};

export const mappingMetadataDecorator = ({ method = 'GET', path = '/' }) => (
  target,
  key,
  descriptor,
) => {
  if (!path) {
    throw new Error('path cannot be empty.');
  }

  Reflect.defineMetadata(REQUEST_METHOD, method, target[key]);

  Reflect.defineMetadata(REQUEST_PATH, path, target[key]);

  return descriptor;
};

export const mappingMiddlewares = (middlewares = []) =>
  compact(
    middlewares.map((mid) => {
      return typeof mid === 'function' && mid;
    }),
  );

export const mappingModuleDecorator = (controllers = [], extraModules = []) => (
  target,
  key,
) => {
  if (key) {
    throw new Error('@Module is not a part of function decorator.');
  }

  const modules = [...extraModules];

  controllers.forEach((controller) => {
    if (!controller) {
      throw new Error('Controller cannot be null.');
    }

    const prefix = Reflect.getMetadata(CONTROLLER_PREFIX, controller) || '/';

    const controllerMiddlewares =
      Reflect.getMetadata(CONTROLLER_MIDDLEWARES, controller) || [];

    const dependencies = Reflect.getMetadata(DEPENDENCIES, controller) || [];

    const dependenciesMapped = dependencies.map(
      (dependency) => new dependency(),
    );

    const self = controller.prototype;

    const instance = new self.constructor(...dependenciesMapped);

    Object.getOwnPropertyNames(self)
      .filter((it) => it !== 'constructor' && typeof self[it] === 'function')
      .forEach((func) => {
        const controllerTarget = instance[func];

        const method = Reflect.getMetadata(REQUEST_METHOD, controllerTarget);

        const path = Reflect.getMetadata(REQUEST_PATH, controllerTarget);

        const multerOptions =
          Reflect.getMetadata(MULTER_OPTIONS, controllerTarget) || [];

        const middlewares =
          Reflect.getMetadata(MIDDLEWARES, controllerTarget) || [];

        if (method && path) {
          const realPath = compact(path.split('/')).join('/');

          const urlRedirect = Reflect.getMetadata(
            URL_REDIRECT,
            controllerTarget,
          );

          const header = Reflect.getMetadata(HEADER, controllerTarget);

          const status =
            Reflect.getMetadata(STATUS_CODE, controllerTarget) || 200;

          const view = Reflect.getMetadata(RENDER_VIEW, controllerTarget);

          const interceptors = Reflect.getMetadata(
            INTERCEPTOR,
            controllerTarget,
          );

          const resolver = (req, res) => {
            return Promise.resolve(controllerTarget.bind(instance)(req, res))
              .then((result) => {
                if (isEqual(result, res)) {
                  return result;
                }

                const handleMappingResolver = (result) => {
                  if (header) {
                    res.set(header);
                  }

                  if (urlRedirect) return res.redirect(status, urlRedirect);

                  if (view) {
                    return res.status(status).render(view, { message: result });
                  }

                  return res.status(status).send(result);
                };

                // handle interceptors
                if (interceptors && interceptors.length !== 0) {
                  return Promise.all(
                    interceptors.map((interceptor) => {
                      if (interceptor && typeof interceptor === 'function') {
                        return Promise.resolve(interceptor(req, result));
                      }

                      return Promise.resolve(null);
                    }),
                  )
                    .then((nestedResults) => {
                      return handleMappingResolver(
                        last(nestedResults) || result,
                      );
                    })
                    .catch((error) => {
                      throw error;
                    });
                }

                return handleMappingResolver(result);
              })
              .catch((error) => {
                throw error;
              });
          };

          modules.push({
            path: `/${compact(`${prefix}/${realPath}`.split('/')).join('/')}`,
            method,
            multerOptions,
            middlewares: [...controllerMiddlewares, ...middlewares],
            resolver,
          });
        }
      });
  });

  Reflect.defineMetadata(MODULE, modules, target.prototype);
};

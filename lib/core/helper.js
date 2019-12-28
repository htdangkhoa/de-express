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
  MODULE,
} from './constant';

export const mappingMetadataDecorator = ({ method = 'GET', path = '/' }) => (
  target,
  key,
  descriptor,
) => {
  Reflect.defineMetadata(REQUEST_METHOD, method, target[key]);

  Reflect.defineMetadata(REQUEST_PATH, path, target[key]);

  return descriptor;
};

export const mappingModuleDecorator = (controllers = []) => (target) => {
  const modules = [];

  controllers.forEach((controller) => {
    const prefix = Reflect.getMetadata(CONTROLLER_PREFIX, controller) || '/';

    Object.getOwnPropertyNames(controller.prototype)
      .filter(
        (it) =>
          it !== 'constructor' &&
          typeof controller.prototype[it] === 'function',
      )
      .map((func) => {
        const controllerTarget = controller.prototype[func];

        const method = Reflect.getMetadata(REQUEST_METHOD, controllerTarget);

        const path = Reflect.getMetadata(REQUEST_PATH, controllerTarget);

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

          const resolver = (req, res) => {
            Promise.resolve(controllerTarget(req, res))
              .then((result) => {
                if (isEqual(result, res)) {
                  return result;
                }

                if (header) {
                  res.set(header);
                }

                if (urlRedirect) return res.redirect(status, urlRedirect);

                if (view) {
                  return res.status(status).render(view, { message: result });
                }

                return res.status(status).json(result);
              })
              .catch((error) => {
                throw error;
              });
          };

          modules.push({ method, path: `${prefix}${realPath}`, resolver });
        }
      });
  });

  Reflect.defineMetadata(MODULE, { modules }, target.prototype);
};

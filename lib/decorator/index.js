import 'reflect-metadata';
import compact from 'lodash.compact';
import {
  mappingMetadataDecorator,
  mappingMiddlewares,
  mappingModuleDecorator,
  MulterStrategy,
} from '../core/helper';
import {
  URL_REDIRECT,
  STATUS_CODE,
  HEADER,
  RENDER_VIEW,
  CONTROLLER_PREFIX,
  CONTROLLER_MIDDLEWARES,
  HOOKS,
  INTERCEPTOR,
  MULTER_OPTIONS,
  MIDDLEWARES,
  INJECTABLE,
  DEPENDENCIES,
  MODULE,
} from '../core/constant';

export const Get = (path = '/') =>
  mappingMetadataDecorator({ method: 'GET', path });

export const Post = (path = '/') =>
  mappingMetadataDecorator({ method: 'POST', path });

export const Put = (path = '/') =>
  mappingMetadataDecorator({ method: 'PUT', path });

export const Delete = (path = '/') =>
  mappingMetadataDecorator({ method: 'DELETE', path });

export const Patch = (path = '/') =>
  mappingMetadataDecorator({ method: 'PATCH', path });

export const All = (path = '/') =>
  mappingMetadataDecorator({ method: 'ALL', path });

export const Options = (path = '/') =>
  mappingMetadataDecorator({ method: 'OPTIONS', path });

export const Head = (path = '/') =>
  mappingMetadataDecorator({ method: 'HEAD', path });

export const Redirect = (url, statusCode = 301) => (
  target,
  key,
  descriptor,
) => {
  if (!url) {
    throw new Error('url cannot be empty.');
  }

  Reflect.defineMetadata(URL_REDIRECT, url, target[key]);

  return StatusCode(statusCode)(target, key, descriptor);
};

export const StatusCode = (statusCode = 200) => (target, key, descriptor) => {
  if (!statusCode) {
    throw new Error('statusCode cannot be empty.');
  }

  const redirectStatusCode = Reflect.getMetadata(STATUS_CODE, target[key]);

  Reflect.defineMetadata(
    STATUS_CODE,
    redirectStatusCode ? redirectStatusCode : statusCode,
    target[key],
  );

  return descriptor;
};

export const Header = (header) => (target, key, descriptor) => {
  if (!header) {
    throw new Error('header cannot be empty.');
  }

  Reflect.defineMetadata(HEADER, header, target[key]);

  return descriptor;
};

export const Render = (viewName) => (target, key, descriptor) => {
  if (!viewName) {
    throw new Error('viewName cannot be empty.');
  }

  Reflect.defineMetadata(RENDER_VIEW, viewName, target[key]);

  return descriptor;
};

export const Controller = (prefix = '/', ...middleware) => (target, key) => {
  if (key) {
    throw new Error('@Controller is not a part of function decorator.');
  }

  if (!prefix) {
    throw new Error('prefix cannot be empty.');
  }

  const path = compact(prefix.split('/')).join('/');

  Reflect.defineMetadata(CONTROLLER_PREFIX, `/${path}`, target);

  const middlewares = mappingMiddlewares(middleware);

  Reflect.defineMetadata(CONTROLLER_MIDDLEWARES, middlewares, target);
};

export const Module = (options = { controllers: [], imports: [] }) => {
  const { controllers = [], imports = [] } = options;

  const extraModules = [];

  imports.forEach((importer) => {
    const modules = Reflect.getMetadata(MODULE, importer.prototype) || [];

    modules.forEach((m) => {
      extraModules.push(m);
    });
  });

  return mappingModuleDecorator(controllers, extraModules);
};

export const Hooks = (...func) => (target, key) => {
  if (key) {
    throw new Error('@Hook is not a part of function decorator.');
  }

  Reflect.defineMetadata(HOOKS, func, target.prototype);
};

export const Interceptors = (...interceptor) => (target, key, descriptor) => {
  if (!key) {
    throw new Error('@Interceptor is not a part of class decorator.');
  }

  Reflect.defineMetadata(INTERCEPTOR, interceptor, target[key]);

  return descriptor;
};

export const Multer = (...option) => (target, key, descriptor) => {
  if (!key) {
    throw new Error('@Multer is not a part of class decorator.');
  }

  const options = option.map((opt) => {
    if (!opt || Object.keys(opt).length === 0) return null;

    const { name, maxCount = 1, strategy = MulterStrategy.OBJECT } = opt;

    if (!name) {
      throw new Error('name cannot be empty.');
    }

    if (typeof maxCount !== 'number' || maxCount < 1) {
      throw new Error('type of maxCount must be number and greater than 1.');
    }

    if (!Object.keys(MulterStrategy).some((str) => strategy.includes(str))) {
      throw new Error(
        `the strategy should be '${MulterStrategy.SINGLE}', '${MulterStrategy.ARRAY}' or '${MulterStrategy.OBJECT}'`,
      );
    }

    return { name, maxCount, strategy };
  });

  Reflect.defineMetadata(MULTER_OPTIONS, compact(options), target[key]);

  return descriptor;
};

export const UploadFile = (name) => (target, key, descriptor) => {
  return Multer({
    name,
    maxCount: 1,
    strategy: 'SINGLE',
  })(target, key, descriptor);
};

export const UploadFiles = (name, maxCount = 1) => (
  target,
  key,
  descriptor,
) => {
  return Multer({
    name,
    maxCount,
    strategy: 'ARRAY',
  })(target, key, descriptor);
};

export const Middlewares = (...middleware) => (target, key, descriptor) => {
  if (!key) {
    throw new Error('@Middlewares is not a part of class decorator.');
  }

  const middlewares = mappingMiddlewares(middleware);

  Reflect.defineMetadata(MIDDLEWARES, middlewares, target[key]);

  return descriptor;
};

export const Injectable = () => (target, key) => {
  if (key) {
    throw new Error('@Dependencies is not a part of function decorator.');
  }

  Reflect.defineMetadata(INJECTABLE, target.prototype, target);
};

export const Dependencies = (...dependency) => (target, key) => {
  if (key) {
    throw new Error('@Dependencies is not a part of function decorator.');
  }

  const dependencies = dependency.map((d) => {
    const dep = Reflect.getMetadata(INJECTABLE, d);

    if (!dep) {
      throw new Error(
        `Can't resolve dependencies of the ${target.name}. Please make sure your dependencies are injected by Injectable decorator.`,
      );
    }

    return d;
  });

  Reflect.defineMetadata(DEPENDENCIES, dependencies, target);
};

import 'reflect-metadata';
import compact from 'lodash.compact';
import {
  mappingMetadataDecorator,
  mappingMiddlewares,
  mappingModuleDecorator,
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
    throw new Error('url cannot be null or undefined.');
  }

  Reflect.defineMetadata(URL_REDIRECT, url, target[key]);

  return StatusCode(statusCode)(target, key, descriptor);
};

export const StatusCode = (statusCode = 200) => (target, key, descriptor) => {
  if (!statusCode) {
    throw new Error('statusCode cannot be null or undefined.');
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
    throw new Error('header cannot be null or undefined.');
  }

  Reflect.defineMetadata(HEADER, header, target[key]);

  return descriptor;
};

export const Render = (viewName) => (target, key, descriptor) => {
  if (!viewName) {
    throw new Error('viewName cannot be null or undefined.');
  }

  Reflect.defineMetadata(RENDER_VIEW, viewName, target[key]);

  return descriptor;
};

export const Controller = (prefix = '/', ...middleware) => (target, key) => {
  if (key) {
    throw new Error('@Controller is not a part of function decorator.');
  }

  if (!prefix) {
    throw new Error('prefix cannot be null or undefined.');
  }

  const path = compact(prefix.split('/')).join('/');

  Reflect.defineMetadata(CONTROLLER_PREFIX, `/${path}`, target);

  const middlewares = mappingMiddlewares(middleware);

  Reflect.defineMetadata(CONTROLLER_MIDDLEWARES, middlewares, target);
};

export const Module = (...controller) => mappingModuleDecorator(controller);

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
    if (!opt) return null;

    const { name, maxCount = 1 } = opt;

    return name && { name, maxCount };
  });

  Reflect.defineMetadata(MULTER_OPTIONS, compact(options), target[key]);

  return descriptor;
};

export const Middlewares = (...middleware) => (target, key, descriptor) => {
  if (!key) {
    throw new Error('@Middlewares is not a part of class decorator.');
  }

  const middlewares = mappingMiddlewares(middleware);

  Reflect.defineMetadata(MIDDLEWARES, middlewares, target[key]);

  return descriptor;
};

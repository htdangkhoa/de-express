import 'reflect-metadata';
import compact from 'lodash.compact';
import {
  mappingMetadataDecorator,
  mappingModuleDecorator,
} from '../core/helper';
import {
  URL_REDIRECT,
  STATUS_CODE,
  HEADER,
  RENDER_VIEW,
  CONTROLLER_PREFIX,
  HOOKS,
  INTERCEPTOR,
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
  Reflect.defineMetadata(URL_REDIRECT, url, target[key]);

  return StatusCode(statusCode)(target, key, descriptor);
};

export const StatusCode = (code = 200) => (target, key, descriptor) => {
  const redirectStatusCode = Reflect.getMetadata(STATUS_CODE, target[key]);

  Reflect.defineMetadata(
    STATUS_CODE,
    redirectStatusCode ? redirectStatusCode : code,
    target[key],
  );

  return descriptor;
};

export const Header = (header) => (target, key, descriptor) => {
  Reflect.defineMetadata(HEADER, header, target[key]);

  return descriptor;
};

export const Render = (viewName) => (target, key, descriptor) => {
  Reflect.defineMetadata(RENDER_VIEW, viewName, target[key]);

  return descriptor;
};

export const Controller = (prefix = '') => (target) => {
  const path = compact(prefix.split('/')).join('/');

  Reflect.defineMetadata(CONTROLLER_PREFIX, `/${path}`, target);
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

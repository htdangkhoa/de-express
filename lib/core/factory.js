import 'reflect-metadata';
import Express from 'express';
import Multer from 'multer';
import compact from 'lodash.compact';
import { MODULE, HOOKS } from './constant';

class Factory {
  static app = Express();

  static upload;

  static async create({ module, debug = true, multer }) {
    if (!module) {
      throw new Error(`Module is required in Factory. You're missing module.`);
    }

    const modules = Reflect.getMetadata(MODULE, module.prototype) || [];

    const hooks = Reflect.getMetadata(HOOKS, module.prototype);

    const haveHooks = hooks && hooks.length !== 0;

    if (debug) {
      console.log('Modules are mapped.');

      console.info(JSON.stringify(modules, null, 2));

      if (haveHooks) {
        console.log('List of hook.');

        console.log(
          compact(
            hooks.map((hook) => {
              return hook && typeof hook === 'function' && hook.prototype;
            }),
          ),
        );
      }
    }

    if (haveHooks) {
      const listHook = await Promise.all(
        hooks.map((hook) => {
          if (hook && typeof hook === 'function') {
            return Promise.resolve(hook());
          }

          return Promise.resolve(null);
        }),
      );

      listHook.forEach((resultReturnedFromHook) => {
        if (resultReturnedFromHook) {
          const { request } = this.app;

          Object.assign(request, resultReturnedFromHook);
        }
      });
    }

    if (multer) {
      this.upload = Multer(multer);
    }

    modules.forEach((m) => {
      const { method, path, resolver, multerOptions } = m;

      if (this.upload && multerOptions.length !== 0) {
        this.app[method.toLowerCase()](
          path,
          this.upload.fields(multerOptions),
          resolver,
        );
      } else {
        this.app[method.toLowerCase()](path, resolver);
      }
    });

    return this;
  }

  static applyMiddlewares(...handlers) {
    handlers.forEach((handler) => this.app.use(handler));

    return this;
  }

  static setViewEngine(ext, fn) {
    this.app.engine(ext, fn);

    this.app.set('view engine', ext);

    return this;
  }

  static setViewDir(root) {
    this.app.set('views', root);

    return this;
  }

  static serveStaticDir(root, options = {}) {
    this.app.use(Express.static(root, options));

    return this;
  }
}

export default Factory;

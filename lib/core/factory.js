import 'reflect-metadata';
import Express from 'express';
import Multer from 'multer';
import compact from 'lodash.compact';
import last from 'lodash.last';
import { MODULE, HOOKS } from './constant';

class Factory {
  static app = Express();

  static #upload;

  static async create(module, options) {
    if (!module) {
      throw new Error(`Module is required in Factory. You're missing module.`);
    }

    const modules = Reflect.getMetadata(MODULE, module.prototype) || [];

    const hooks = Reflect.getMetadata(HOOKS, module.prototype);

    const haveHooks = Array.isArray(hooks) && compact(hooks).length !== 0;

    if (
      (typeof options === 'boolean' && options) ||
      (options && options.debug)
    ) {
      console.log('Modules are mapped.');

      console.log(modules);

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

    if (typeof options === 'object' && options.multer) {
      this.#upload = Multer(options.multer);
    }

    modules.forEach((m) => {
      const { path, method, multerOptions, middlewares, resolver } = m;

      if (!this.#upload && multerOptions.length !== 0) {
        throw new Error(
          `
            Maybe you're using @Multer, @UploadFile or @UploadFiles decorator but you're missing define multer options.
            Please see: https://github.com/expressjs/multer#multeropts
          `.trim(),
        );
      } else if (this.#upload && multerOptions.length !== 0) {
        if (multerOptions.length > 1) {
          const opts = multerOptions.map(({ name, maxCount }) => ({
            name,
            maxCount,
          }));

          this.app[method.toLowerCase()](path, this.#upload.fields(opts), [
            ...middlewares,
            resolver,
          ]);
        } else {
          const { name, maxCount, strategy } = last(multerOptions) || {};

          switch (strategy) {
            case 'SINGLE': {
              this.app[method.toLowerCase()](path, this.#upload.single(name), [
                ...middlewares,
                resolver,
              ]);

              break;
            }
            case 'ARRAY': {
              this.app[method.toLowerCase()](
                path,
                this.#upload.array(name, maxCount),
                [...middlewares, resolver],
              );

              break;
            }
            default: {
              this.app[method.toLowerCase()](
                path,
                this.#upload.fields([{ name, maxCount }]),
                [...middlewares, resolver],
              );

              break;
            }
          }
        }
      } else {
        this.app[method.toLowerCase()](path, [...middlewares, resolver]);
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

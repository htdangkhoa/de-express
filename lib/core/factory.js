import 'reflect-metadata';
import express from 'express';
import { MODULE } from './constant';

class Factory {
  static app = express();

  static create(module, debug = true) {
    if (!module) {
      throw new Error(`Module is required in Factory. You're missing module.`);
    }

    const { modules = [] } = Reflect.getMetadata(MODULE, module.prototype);

    if (debug) {
      console.log('Modules are mapped.');

      console.log(modules);
    }

    modules.forEach((m) => {
      const { method, path, resolver } = m;

      this.app[method.toLowerCase()](path, resolver);
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
    this.app.use(express.static(root, options));

    return this;
  }
}

export default Factory;

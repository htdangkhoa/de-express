import { Controller, All, Middlewares } from '../../dist/decorator';

const middlewares = [
  (req, res, next) => {
    console.log('Mid 1.');

    return next();
  },
  (req, res, next) => {
    console.log('Mid 2.');

    return next();
  },
];

@Controller('/middlewares')
class MiddlewareController {
  @All('/simple')
  @Middlewares(...middlewares)
  simpleMiddleware() {
    return { message: true };
  }
}

export default MiddlewareController;

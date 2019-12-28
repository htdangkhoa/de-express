import { Controller, Get } from '../../dist/decorator';

@Controller('/error')
class ErrorController {
  @Get()
  internalServerError() {
    return { foo: bar };
  }
}

export default ErrorController;

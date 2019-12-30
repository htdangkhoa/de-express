import { Controller, Get, Interceptors } from '../../dist/decorator';

@Controller('/interceptors')
class InterceptorController {
  @Get('/basic')
  @Interceptors(() => {
    console.log('basic interceptor: still keep origin data.');
  })
  basicInterceptor() {
    return { foo: 'bar' };
  }

  @Get('/transform')
  @Interceptors(
    (req, data) => data, // Interceptor 1.
    (req, data) => ({ oldData: data, newData: { ping: 'pong' } }), // Interceptor 2.
  )
  transformDataWithInterceptor() {
    return { foo: 'bar' };
  }
}

export default InterceptorController;

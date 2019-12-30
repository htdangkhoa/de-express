import { Get, Post, Render, Interceptors } from '../../dist/decorator';

class GeneralController {
  @Get()
  @Interceptors(
    () =>
      new Promise((resolve) =>
        setTimeout(() => {
          console.log('Test interceptor: Should show before send to client.');

          return resolve();
        }, 3000),
      ),
  )
  async greeting(req, res) {
    if (req.query.greeting) {
      return res
        .status(202)
        .json({ message: `Hello ${req.query.greeting}!!!` });
    }

    return { message: 'Hello world!!!' };
  }

  @Get('/home')
  @Render('index')
  renderHome() {}

  @Get('/home-with-message')
  @Render('index')
  renderHomeWithMessage() {
    return { foo: 'bar' };
  }
}

export default GeneralController;

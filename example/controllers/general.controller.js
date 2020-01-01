import { Get, Render } from '../../dist/decorator';

class GeneralController {
  @Get()
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

import { Get, Render, Dependencies } from '../../dist/decorator';
import AppService from '../services/app.service';

@Dependencies(AppService)
class GeneralController {
  constructor(appService) {
    this.appService = appService;
  }

  @Get()
  async greeting(req, res) {
    if (req.query.greeting) {
      return res
        .status(202)
        .json({ message: `Hello ${req.query.greeting}!!!` });
    }

    return this.appService.helloWorld();
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

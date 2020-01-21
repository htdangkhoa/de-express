import { Injectable } from '../../dist/decorator';

@Injectable()
class AppService {
  helloWorld() {
    return { message: 'Hello world!!!' };
  }
}

export default AppService;

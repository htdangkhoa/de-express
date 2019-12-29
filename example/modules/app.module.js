import { Module, Hook } from '../../dist/decorator';
import GeneralController from '../controllers/general.controller';
import ErrorController from '../controllers/error.controller';

const helloHook = () => {
  console.log('Hello hook');
};

export default
@Hook(helloHook)
@Module(GeneralController, ErrorController)
class AppModule {}

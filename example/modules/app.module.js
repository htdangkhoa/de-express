import { Module, Hooks } from '../../dist/decorator';
import GeneralController from '../controllers/general.controller';
import ErrorController from '../controllers/error.controller';
import InterceptorController from '../controllers/interceptor.controller';

const helloHook = () => {
  console.log('Hello hook');
};

export default
@Hooks(helloHook)
@Module(GeneralController, ErrorController, InterceptorController)
class AppModule {}

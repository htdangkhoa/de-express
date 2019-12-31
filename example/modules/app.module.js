import { Module, Hooks } from '../../dist/decorator';
import GeneralController from '../controllers/general.controller';
import ErrorController from '../controllers/error.controller';
import InterceptorController from '../controllers/interceptor.controller';
import UploadController from '../controllers/upload.controller';

const helloHook = () => {
  console.log('Hello hook');
};

export default
@Hooks(helloHook)
@Module(
  GeneralController,
  ErrorController,
  InterceptorController,
  UploadController,
)
class AppModule {}

import { Module } from '../../dist/decorator';
import GeneralController from '../controllers/general.controller';
import ErrorController from '../controllers/error.controller';

export default
@Module(GeneralController, ErrorController)
class AppModule {}

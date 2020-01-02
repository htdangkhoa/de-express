import {
  Controller,
  Post,
  UploadFile,
  UploadFiles,
  Multer,
} from '../../dist/decorator';

@Controller('/upload')
class UploadController {
  @Post('/single')
  @UploadFile('avatar')
  uploadSingle(req, _res) {
    console.log(req.file);

    return { avatar: req.file };
  }

  @Post('/multiple')
  @UploadFiles('avatars', 2)
  uploadMultiple(req, _res) {
    console.log(req.files.length);

    return { avatars: req.files };
  }

  @Post('/multiple-fields')
  @Multer({ name: 'images', maxCount: 1 })
  uploadMultipleFields(req, _res) {
    console.log(req.files);

    return { files: req.files };
  }
}

export default UploadController;

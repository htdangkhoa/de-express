import { Controller, Post, Multer } from '../../dist/decorator';

@Controller('/upload')
class UploadController {
  @Post('/single')
  @Multer({ name: 'avatars' })
  uploadSingle(req, _res) {
    console.log(req.files.avatars.length);

    return { avatars: req.files.avatars };
  }

  @Post('/multiple')
  @Multer({ name: 'avatars', maxCount: 2 })
  uploadMultiple(req, _res) {
    console.log(req.files.avatars.length);

    return { avatars: req.files.avatars };
  }

  @Post('/multiple-fields')
  @Multer({ name: 'avatars', maxCount: 1 }, { name: 'images', maxCount: 1 })
  uploadMultipleFields(req, _res) {
    console.log(req.files.avatars);

    console.log(req.files.images);

    return { files: req.files };
  }
}

export default UploadController;

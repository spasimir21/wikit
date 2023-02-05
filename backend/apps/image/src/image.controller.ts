import { FileInterceptor } from '@nestjs/platform-express';
import { LoggedInGuard, TokenGuard } from '@wikit/utils';
import { Config, CONFIG } from '@wikit/config';
import { ImageService } from './image.service';
import { Response } from 'express';
import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';

@Controller()
class ImageController {
  constructor(@Inject(CONFIG) private readonly config: Config, private readonly imageService: ImageService) {}

  @Get(':hash')
  @HttpCode(HttpStatus.OK)
  async getImage(@Res() res: Response, @Param('hash') hash: string) {
    const stream = await this.imageService.getImage(hash);

    if (stream == null) throw new HttpException('Image not found!', HttpStatus.NOT_FOUND);

    res.setHeader('Content-Type', `image/${this.config.image.format}`);
    stream.pipe(res);
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(TokenGuard, LoggedInGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@Res() res: Response, @UploadedFile() image: Express.Multer.File) {
    try {
      const hash = await this.imageService.saveImage(image.buffer);
      res.send({ hash });
    } catch (err) {
      throw new HttpException({ message: 'Upload failed!' }, HttpStatus.BAD_REQUEST);
    }
  }
}

export { ImageController };

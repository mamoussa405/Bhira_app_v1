import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { FilesValidation } from '../enums/files-validation.enum';
import { IFiles } from 'src/types/files.type';

type Files = Express.Multer.File[] | IFiles;
/**
 * Pipe for validating the images.
 */
@Injectable()
export class ValidateFilesPipe implements PipeTransform {
  constructor(private uploadType?: string) {}

  transform(files: Files, metadata: ArgumentMetadata) {
    if (metadata.type === 'custom') {
      if (this.uploadType === FilesValidation.PRODUCT)
        this.validateProductImages(files);
      else if (this.uploadType === FilesValidation.STORY)
        this.validateStoryFiles(files);
      else this.validateProfileImage(files);
    }
    return files;
  }

  private validateProductImages(images: Files) {
    /**
     * In this line we are declaring the maximum size allowed
     * for each the image, in this case 2MB.
     * To explain this line, we have to know that the size of
     * the image is in bytes, so we have to multiply the size
     * by 1024 (1KB = 1024 bytes) and then by 1024 again (1MB = 1024KB).
     */
    const imageSize = 1024 * 1024 * 2;
    // Here we are casting the files to the Express.Multer.File[] type.
    images = images as Express.Multer.File[];

    if (!images || !images.length || images.length > 3)
      throw new BadRequestException('You must upload 1 to 3 images!');
    for (const image of images) {
      if (image.size > imageSize)
        throw new BadRequestException('Image too large!');
      /**
       * Here we are checking if the image is in the correct format,
       * in this case we are only allowing jpg, jpeg and png files.
       */
      if (
        !image.mimetype
          .toLowerCase()
          .match(/^(image\/jpg|image\/jpeg|image\/png)$/)
      ) {
        throw new BadRequestException('Only image files are allowed!');
      }
    }
  }

  private validateStoryFiles(files: Files) {
    /**
     * In this line we are declaring the maximum size allowed
     * for each the image and video, in this case 2MB and 10MB.
     * To explain this line, we have to know that the size of
     * the image and the video is in bytes, so we have to multiply
     * the size by 1024 (1KB = 1024 bytes) and then by 1024 again
     * (1MB = 1024KB). The same applies to the video.
     */
    const imageSize = 1024 * 1024 * 2;
    const videoSize = 1024 * 1024 * 10;
    // Here we are casting the files to the IFiles interface.
    files = files as IFiles;

    if (!files.image || !files.image.length || files.image.length > 1)
      throw new BadRequestException('You must upload 1 image!');
    if (!files.video || !files.video.length || files.video.length > 1)
      throw new BadRequestException('You must upload 1 video!');

    if (files.image[0].size > imageSize)
      throw new BadRequestException('Image too large!');
    /**
     * Here we are checking if the image is in the correct format,
     * in this case we are only allowing jpg, jpeg and png files.
     */
    if (
      !files.image[0].mimetype
        .toLowerCase()
        .match(/^(image\/jpg|image\/jpeg|image\/png)$/)
    ) {
      throw new BadRequestException('Only image files are allowed!');
    }

    if (files.video[0].size > videoSize)
      throw new BadRequestException('Video too large!');
    /**
     * Here we are checking if the video is in the correct format,
     * in this case we are only allowing mp4 and mov files.
     */
    if (
      !files.video[0].mimetype.toLowerCase().match(/^(video\/mp4|video\/mov)$/)
    ) {
      throw new BadRequestException('Only video files are allowed!');
    }
  }

  private validateProfileImage(image: Files) {
    /**
     * In this line we are declaring the maximum size allowed
     * for each image, in this case 2MB.
     * To explain this line, we have to know that the size of
     * the image is in bytes, so we have to multiply the size
     * by 1024 (1KB = 1024 bytes) and then by 1024 again (1MB = 1024KB).
     */
    const imageSize = 1024 * 1024 * 2;
    // Here we are casting the files to the Express.Multer.File type.
    image = image as Express.Multer.File[];

    if (!image || !image.length || image.length > 1)
      throw new BadRequestException('You must upload 1 image!');
    if (image[0].size > imageSize)
      throw new BadRequestException('Image too large!');
    /**
     * Here we are checking if the image is in the correct format,
     * in this case we are only allowing jpg, jpeg and png files.
     */
    if (
      !image[0].mimetype
        .toLowerCase()
        .match(/^(image\/jpg|image\/jpeg|image\/png)$/)
    ) {
      throw new BadRequestException('Only image files are allowed!');
    }
  }
}

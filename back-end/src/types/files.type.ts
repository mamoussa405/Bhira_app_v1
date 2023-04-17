/**
 * This interface is used to define the files that are going to be
 * uploaded, in this case images and videos.
 */
export interface IFiles {
  image: Express.Multer.File[];
  video: Express.Multer.File[];
}

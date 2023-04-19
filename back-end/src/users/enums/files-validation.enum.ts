/**
 * This enum is used to let the validation pipe knows
 * which files to validate, in this case the product images
 * or the story files or the profile avatar.
 */
export enum FilesValidation {
  PRODUCT = 'product',
  STORY = 'story',
  PROFILE = 'profile',
}

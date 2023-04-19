import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

/**
 * This pipe is used to transform the phone number to the format,
 * +212 xxx xxx xxx.
 */
@Injectable()
export class TransformPhoneNumberPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Check if the data passed to the pipe is the body of the request.
    if (metadata.type === 'body') {
      /**
       * First regex matches +212 and spaces, second regex matches 0
       * at the beginning of the string.
       */
      const REGEX1 = /^\s*\+212\s*/g;
      const REGEX2 = /^0/;

      /**
       * If the phone number starts with +212 and spaces, replace the
       * matched regex with '+212 '.
       * Else, replace the first 0 with '+212 '
       */
      if (REGEX1.test(value.phoneNumber)) {
        value.phoneNumber = value.phoneNumber.replace(REGEX1, '+212 ');
      } else {
        value.phoneNumber = value.phoneNumber.replace(REGEX2, '+212 ');
      }
    }
    return value;
  }
}

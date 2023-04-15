import { SetMetadata } from '@nestjs/common';
import { PublicEnum } from 'src/enums/common.enum';
/**
 * This decorator is used to mark a route as public,
 * so that it can be accessed without a JWT token.
 */
export const Public = () => SetMetadata(PublicEnum.IS_PUBLIC_ROUTE, true);

import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';

/**
 * AdminGuard is a guard that will be used to protect routes,
 * it will check if the user is an admin or not
 */
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const user = await this.userRepository.findOne(req['user'].sub);
      if (!user) throw new NotFoundException('User not found');
      if (!user.isAdmin) throw new UnauthorizedException('User is not admin');

      return true;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      if (error.status === HttpStatus.UNAUTHORIZED)
        throw new UnauthorizedException(error.message);
      throw new InternalServerErrorException(
        'Something went wrong in the admin guard',
      );
    }
  }
}

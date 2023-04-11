import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  
  constructor(private prisma: PrismaService) {

  }

  

  async signup(dto : AuthDto) {
    
    //generate the password hash
    const passwordHash = await argon.hash(dto.password);

    
    //save the user to the database
    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        hash : passwordHash,
      }
    });

    //return the user
    return user;
  }

  login() {
    return 'i HAVE LOGGED IN';
  }

}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  
  constructor(private prisma: PrismaService) {

  }

  

  signup() {
    return 'I have created a new user';
  }

  login() {
    return 'i HAVE LOGGED IN';
  }

}

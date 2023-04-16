import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { OrderModule } from 'src/orders/order.module';

@Module({
  imports: [AuthModule, AdminModule, OrderModule],
})
export class UserModule {}

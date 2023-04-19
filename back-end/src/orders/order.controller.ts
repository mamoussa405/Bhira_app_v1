import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  CreateOrderParamDto,
  CreateOrderQueryDto,
} from './dto/order.dto';
import { Request } from 'express';
import { ICartOrder } from 'src/types/order.type';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  async createOrder(
    @Body() order: CreateOrderDto,
    @Query() queries: CreateOrderQueryDto,
    @Req() req: Request,
  ) {
    return await this.orderService.createOrder(
      order,
      queries.productId,
      req['user'].sub,
    );
  }

  @Get('get')
  async getAddedToCartOrders(@Req() req: Request): Promise<ICartOrder[]> {
    return await this.orderService.getAddedToCartOrders(req['user'].sub);
  }

  @Delete('delete/:id')
  async deleteOrder(@Param() params: CreateOrderParamDto, @Req() req: Request) {
    return await this.orderService.deleteOrder(params.id, req['user'].sub);
  }
}

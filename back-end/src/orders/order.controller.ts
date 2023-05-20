import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  ConfirmOrdersBuyDto,
  CreateOrderDto,
  CreateOrderParamDto,
  CreateOrderQueryDto,
} from './dto/order.dto';
import { Request } from 'express';
import { ICartOrder, IDeleteOrder } from 'src/types/order.type';
import { TransformPhoneNumberPipe } from 'src/pipes/transform-phone-number.pipe';
import { IConfirmationMessage } from 'src/types/response.type';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('get')
  async getAddedToCartOrders(@Req() req: Request): Promise<ICartOrder[]> {
    return await this.orderService.getAddedToCartOrders(req['user'].sub);
  }

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

  @Patch('confirm')
  @UsePipes(TransformPhoneNumberPipe)
  async confirmOrdersBuy(
    @Body() body: ConfirmOrdersBuyDto,
    @Req() req: Request,
  ): Promise<IConfirmationMessage> {
    return await this.orderService.confirmOrdersBuy(body, req['user'].sub);
  }

  @Delete('delete/:id')
  async deleteOrder(
    @Param() params: CreateOrderParamDto,
    @Req() req: Request,
  ): Promise<IDeleteOrder> {
    return await this.orderService.deleteOrder(params.id, req['user'].sub);
  }
}

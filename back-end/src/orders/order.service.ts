import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfirmOrdersBuyDto, CreateOrderDto } from './dto/order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/auth/entities/user.entity';
import { ProductService } from 'src/products/product.service';
import { ProductEntity } from 'src/products/entities/product.entity';
import {
  IAdminProfileOrder,
  ICartOrder,
  IUserProfileOrder,
} from 'src/types/order.type';
import { IConfirmationMessage } from 'src/types/response.type';
import { AppGateway } from 'src/app.gateway';

/**
 * The order service is responsible for orders related operations.
 * @function createOrder - Creates a new order and saves it in the database.
 * @function getAddedToCartOrders - Gets all the orders that are not confirmed by the user.
 * @function getAdminProfileOrders - Gets all the orders that are confirmed by the user.
 * @function getUserProfileOrders - Gets all the orders that are confirmed by the user.
 * @function confirmOrdersBuy - Confirms the buy of the orders by the user.
 * @function confirmOrder - Confirms an order by the admin.
 * @function cancelOrder - Cancels an order by the admin.
 * @function deleteOrder - Deletes an order.
 */
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly productService: ProductService,
    private readonly appGateway: AppGateway,
  ) {}

  /**
   * Creates a new order and saves it in the database, before saving it
   * we fill the order with the neccessary information, like the user
   * who created the order, the product that the user wants to buy and
   * the total price of the order.
   * @param {CreateOrderDto} order - The order that we want to create.
   * @param {number} productId - The id of the product that the user wants to buy.
   * @param {number} userId - The id of the user who created the order.
   * @returns {Promise<IConfirmationMessage>} - A message that confirms that the order was created.
   * @throws {NotFoundException} - If the product is not found or the user is not found.
   * @throws {InternalServerErrorException} - If there is an error while saving the order.
   */
  public async createOrder(
    order: CreateOrderDto,
    productId: number,
    userId: number,
  ): Promise<IConfirmationMessage> {
    try {
      /**
       * First we find the product and the user, then we create a new order
       * and we save it in the database, for the findOne method in the product
       * service it will throw a NotFoundException if the product is not found.
       */
      const product = await this.productService.getProduct(productId);
      /**
       * If the product is a top market product we check if the product is
       * the current top market product, if it is not we throw a NotFoundException.
       * Then we check if the stock is enough to make the order, if it is not
       * we throw a NotFoundException.
       */
      const stock: number = +product.stock - +order.quantity;
      if (product.isTopMarketProduct) {
        if (!product.isCurrentTopMarketProduct)
          throw new NotFoundException(
            'المنتوج غير موجود، المرجوا الاتصال بصاحب التطبيق',
          );
        if (stock < 0) throw new NotFoundException('لا يوجد مخزون كاف');
      }
      const user = await this.userRepository.findOne({ where: { id: userId } });
      /**
       * If the user is not found or the user is not confirmed by the admin
       * we throw a NotFoundException.
       */
      if (!user) throw new NotFoundException('لم يتم العثور على المستخدم');
      const newOrder = this.orderRepository.create(order);

      /* Then we fill the order with the neccessary information.*/
      this.fillOrder(newOrder, order, user, product);
      // TODO: We should use transactions here.
      await this.orderRepository.save(newOrder);
      /**
       * If the product is a top market produt we emit an event to the
       * clients to update the stock of the product,
       * if the stock is 0 we emit an event to the clients to set a new
       * top market product.
       */
      if (product.isTopMarketProduct) {
        await this.productService.updateProductStock(productId, stock);
        if (!stock) {
          const newTopMarketProduct =
            await this.productService.setNewTopMarketProduct(productId);
          this.appGateway.server.emit('new-top-market-product', {
            id: newTopMarketProduct.id,
            name: newTopMarketProduct.name,
            description: newTopMarketProduct.description,
            price: newTopMarketProduct.price,
            stock: newTopMarketProduct.stock,
            imageURL: newTopMarketProduct.imagesURL[0],
          });
        } else
          this.appGateway.server.emit(
            'updated-top-market-product-stock',
            stock,
          );
      }
      return { message: 'Order created successfully' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('خطأ في إنشاء الطلب');
    }
  }

  /**
   * Gets all the orders that are not confirmed by the user, we use this
   * method to get the orders that are in the cart of the user.
   * @param {number} userId - The id of the user who owns the orders.
   * @returns {Promise<ICartOrder[]>} - The orders that are in the cart of the user.
   * @throws {InternalServerErrorException} - If there is an error while getting the orders.
   * @throws {NotFoundException} - If there are no orders in the cart of the user.
   */
  public async getAddedToCartOrders(userId: number): Promise<ICartOrder[]> {
    try {
      /**
       * First we get all the orders that are not confirmed by the user,
       * then we filter the orders to get only the orders that belong to
       * the user with the {userId}, most likely the user who logged in.
       */
      const orders = await this.orderRepository.find({
        where: { buyConfirmedByUser: false },
        relations: ['product', 'user'],
      });
      const res: ICartOrder[] = [];

      for (const order of orders) {
        if (order.user.id === userId)
          res.push({
            id: order.id,
            quantity: order.quantity,
            totalPrice: order.totalPrice,
            product: {
              name: order.product.name,
              imageURL: order.product.imagesURL[0],
              price: order.product.price,
            },
          });
      }
      if (!res.length)
        throw new NotFoundException('لم يتم العثور على أية طلبات');
      return res;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('خطأ في الحصول على الطلبات');
    }
  }

  /**
   * Gets all the orders that are confirmed by the user, we use this
   * method to get the orders that should be displayed in the admin's
   * profile page.
   * @returns {Promise<IAdminProfileOrder[]>} - The orders that are confirmed by the user.
   * @throws {InternalServerErrorException} - If there is an error while getting the orders.
   */
  public async getAdminProfileOrders(): Promise<IAdminProfileOrder[]> {
    try {
      /**
       * First we get all the orders that are confirmed by the user,
       * then we iterate through the orders and we create a new object
       * that contains only the information that we want to display in
       * the admin's profile page.
       */
      const orders = await this.orderRepository.find({
        where: { buyConfirmedByUser: true },
        relations: ['product', 'user'],
      });
      const res: IAdminProfileOrder[] = [];

      for (const order of orders) {
        res.push({
          id: order.id,
          quantity: order.quantity,
          totalPrice: order.totalPrice,
          buyerName: order.buyerName,
          buyerPhoneNumber: order.buyerPhoneNumber,
          shipmentAddress: order.shipmentAddress,
          orderTime: order.orderTime,
          confirmedByAdmin: order.buyConfirmedByAdmin,
          product: {
            name: order.product.name,
            imageURL: order.product.imagesURL[0],
          },
        });
      }
      return res;
    } catch (error) {
      throw new InternalServerErrorException('خطأ في الحصول على الطلبات');
    }
  }

  /**
   * Gets all the orders that are confirmed by the user, we use this
   * method to get the orders that should be displayed in the user's
   * profile page.
   * @param {number} userId - The id of the user that owns the profile page.
   * @returns {Promise<IUserProfileOrder[]>} - The orders that are confirmed by the user.
   * @throws {InternalServerErrorException} - If there is an error while getting the orders.
   */
  public async getUserProfileOrders(
    userId: number,
  ): Promise<IUserProfileOrder[]> {
    try {
      /**
       * First we get all the orders that are confirmed by the user,
       * then we filter the orders to get only the orders that belong to
       * the user with the {userId}, most likely the user who logged in.
       */
      const orders = await this.orderRepository.find({
        where: { buyConfirmedByUser: true },
        relations: ['product', 'user'],
      });
      const res: IUserProfileOrder[] = [];

      for (const order of orders) {
        if (order.user.id === userId)
          res.push({
            id: order.id,
            quantity: order.quantity,
            totalPrice: order.totalPrice,
            shipmentAddress: order.shipmentAddress,
            orderTime: order.orderTime,
            confirmedByAdmin: order.buyConfirmedByAdmin,
            product: {
              name: order.product.name,
              imageURL: order.product.imagesURL[0],
            },
          });
      }
      return res;
    } catch (error) {
      throw new InternalServerErrorException('خطأ في الحصول على الطلبات');
    }
  }

  /**
   * Delete an order, we use this method to delete an order from the cart.
   * @param {number} orderId - The id of the order to be deleted.
   * @param {number} userId - The id of the user who owns the order.
   * @returns {Promise<IConfirmationMessage>} - A message that confirms the deletion.
   * @throws {InternalServerErrorException} - If there is an error while deleting the order.
   * @throws {NotFoundException} - If the order is not found.
   * @throws {UnauthorizedException} - If the user is not the owner of the order.
   */
  public async deleteOrder(
    orderId: number,
    userId: number,
  ): Promise<IConfirmationMessage> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['user', 'product'],
      });

      if (!order) throw new NotFoundException('الطلب غير موجود');
      if (order.user.id !== userId)
        throw new UnauthorizedException('المستخدم ليس صاحب الطلب');
      // TODO: We should use transactions here.
      await this.orderRepository.delete(orderId);
      /**
       * If the order is for a top market product, we need to update the
       * stock of the product, and if the product is the current top
       * market product, we need to emit an event to update the stock
       * of the product in the top market component.
       */
      if (order.product.isTopMarketProduct) {
        const stock = +order.product.stock + +order.quantity;
        await this.productService.updateProductStock(order.product.id, stock);
        if (order.product.isCurrentTopMarketProduct)
          this.appGateway.server.emit(
            'updated-top-market-product-stock',
            stock,
          );
      }
      return { message: 'Order deleted successfully' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      if (error.status === HttpStatus.UNAUTHORIZED)
        throw new UnauthorizedException(error.message);
      throw new InternalServerErrorException('خطأ في حذف الطلب');
    }
  }

  /**
   * Confirm the orders that the user added to the cart, we use this
   * to confirm that the user wants to buy the products that are in the
   * cart.
   * @param {ConfirmOrdersBuyDto} body - The body of the request.
   * @param {number} userId - The id of the user who owns the orders.
   * @returns {Promise<IConfirmationMessage>} - A message that confirms the confirmation.
   * @throws {InternalServerErrorException} - If there is an error while confirming the orders.
   * @throws {NotFoundException} - If one of the orders is not found.
   * @throws {UnauthorizedException} - If one of the orders is not owned by the user.
   */
  public async confirmOrdersBuy(
    body: ConfirmOrdersBuyDto,
    userId: number,
  ): Promise<IConfirmationMessage> {
    try {
      /**
       * First we check if the orders that the user wants to confirm exist,
       * and belong to the user with the {userId}, most likely the user who
       * logged in, then we update the orders to set the {buyConfirmedByUser}
       * to true, and we set the other fields to the values that the user
       * sent in the request. Finally we update the order time.
       */
      for (const order of body.orders) {
        const orderToConfirm = await this.orderRepository.findOne({
          where: { id: order.id },
          relations: ['user'],
        });
        if (!orderToConfirm) throw new NotFoundException('الطلب غير موجود');
        if (orderToConfirm.user.id !== userId)
          throw new UnauthorizedException('المستخدم ليس صاحب الطلبات');
      }
      for (const order of body.orders) {
        await this.orderRepository.update(order.id, {
          buyConfirmedByUser: true,
          quantity: order.quantity,
          totalPrice: order.totalPrice,
          buyerName: body.buyerName,
          buyerPhoneNumber: body.phoneNumber,
          shipmentAddress: body.shipmentAddress,
          orderTime: new Date(),
        });
      }
      return { message: 'Orders confirmed successfully' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      if (error.status === HttpStatus.UNAUTHORIZED)
        throw new UnauthorizedException(error.message);
      throw new InternalServerErrorException('خطأ في تأكيد الطلبات');
    }
  }

  /**
   * Confirms an order, we use this method to let the admin confirm an order.
   * @param {number} orderId - The id of the order to be confirmed.
   * @returns {Promise<IConfirmationMessage>} - A message that confirms the confirmation.
   * @throws {InternalServerErrorException} - If there is an error while confirming the order.
   * @throws {NotFoundException} - If the order is not found.
   */
  public async confirmOrder(orderId: number): Promise<IConfirmationMessage> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });

      if (!order) throw new NotFoundException('الطلب غير موجود');
      await this.orderRepository.update(orderId, { buyConfirmedByAdmin: true });
      // TODO: Emit the event to the user who owns the order, and to the all admins.
      this.appGateway.server.emit('confirmed-order', orderId);
      return { message: 'Order confirmed successfully' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('خطأ في تأكيد الطلب');
    }
  }

  /**
   * Cancels an order, we use this method to let the admin cancel an order.
   * @param {number} orderId - The id of the order to be canceled.
   * @returns {Promise<IConfirmationMessage>} - A message that confirms the cancellation.
   * @throws {InternalServerErrorException} - If there is an error while canceling the order.
   * @throws {NotFoundException} - If the order is not found.
   */
  public async cancelOrder(orderId: number): Promise<IConfirmationMessage> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['product'],
      });

      if (!order) throw new NotFoundException('الطلب غير موجود');
      // TODO: We should use transactions here.
      await this.orderRepository.delete(orderId);
      /**
       * If the order is for a top market product, we update the stock of the product,
       * and if the product is the current top market product, we emit an event to
       * update the stock of the product in the top market page.
       * Finally we delete the order.
       */
      if (order.product.isTopMarketProduct) {
        const stock = +order.product.stock + +order.quantity;
        await this.productService.updateProductStock(order.product.id, stock);
        if (order.product.isCurrentTopMarketProduct)
          this.appGateway.server.emit(
            'updated-top-market-product-stock',
            stock,
          );
      }
      // TODO: Emit the event to the user who owns the order, and to the all admins.
      this.appGateway.server.emit('canceled-order', orderId);
      return { message: 'Order canceled successfully' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException('خطأ في إلغاء الطلب');
    }
  }

  /**
   *  This method will fill the order entity with the necessary information.
   * @param {OrderEntity} newOrder  The order entity
   * @param {CreateOrderDto} order The order dto
   * @param {UserEntity} user The user entity
   * @param {ProductEntity} product The product entity
   */
  private fillOrder(
    newOrder: OrderEntity,
    order: CreateOrderDto,
    user: UserEntity,
    product: ProductEntity,
  ) {
    /**
     * Fill the buyerName, buyerPhoneNumber, shipmentAddress, with the user
     * information, it will be update when the user confirms the order buy.
     */
    newOrder.buyerName = user.name;
    newOrder.buyerPhoneNumber = user.phoneNumber;
    newOrder.shipmentAddress = user.address;
    /**
     * then we fill the quantity and the totalPrice with the order information,
     * coming when the user creates the order.
     */
    newOrder.quantity = order.quantity;
    newOrder.totalPrice = order.totalPrice;

    newOrder.orderTime = new Date();
    /**
     * Finally we fill the user and the product fields with the user and the
     * product that we found before, to create a relation between the order
     * and the user and the product.
     */
    newOrder.user = user;
    newOrder.product = product;
  }
}

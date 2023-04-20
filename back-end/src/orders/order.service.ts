import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
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

/**
 * The order service is responsible for orders related operations.
 * @function createOrder - Creates a new order and saves it in the database.
 * @function getAddedToCartOrders - Gets all the orders that are not confirmed by the user.
 * @function getAdminProfileOrders - Gets all the orders that are confirmed by the user.
 * @function getUserProfileOrders - Gets all the orders that are confirmed by the user.
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
   */
  async createOrder(
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
      const user = await this.userRepository.findOne({ where: { id: userId } });
      /**
       * If the user is not found or the user is not confirmed by the admin
       * we throw a NotFoundException.
       */
      if (!user) throw new NotFoundException('User not found');
      const newOrder = this.orderRepository.create(order);
      // Then we fill the order with the neccessary information.
      this.fillOrder(newOrder, order, user, product);
      await this.orderRepository.save(newOrder);

      return { message: 'Order created successfully' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      if (error.status === HttpStatus.UNAUTHORIZED)
        throw new UnauthorizedException(error.message);
      throw new InternalServerErrorException('Error creating order');
    }
  }

  /**
   *  Gets all the orders that are not confirmed by the user, we use this
   *  method to get the orders that are in the cart of the user.
   * @param {number} userId - The id of the user who owns the orders.
   * @returns {Promise<ICartOrder[]>} - The orders that are in the cart of the user.
   */
  async getAddedToCartOrders(userId: number): Promise<ICartOrder[]> {
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
            },
          });
      }

      return res;
    } catch (error) {
      throw new InternalServerErrorException('Error getting orders');
    }
  }

  /**
   * Gets all the orders that are confirmed by the user, we use this
   * method to get the orders that should be displayed in the admin's
   * profile page.
   * @returns {Promise<IAdminProfileOrder[]>} - The orders that are confirmed by the user.
   */
  async getAdminProfileOrders(): Promise<IAdminProfileOrder[]> {
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
      throw new InternalServerErrorException('Error getting orders');
    }
  }

  /**
   * Gets all the orders that are confirmed by the user, we use this
   * method to get the orders that should be displayed in the user's
   * profile page.
   * @param {number} userId - The id of the user that owns the profile page.
   * @returns {Promise<IUserProfileOrder[]>} - The orders that are confirmed by the user.
   */
  async getUserProfileOrders(userId: number): Promise<IUserProfileOrder[]> {
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
      throw new InternalServerErrorException('Error getting orders');
    }
  }

  /**
   * Delete an order, we use this method to delete an order from the cart.
   * @param {number} orderId - The id of the order to be deleted.
   * @param {number} userId - The id of the user who owns the order.
   * @returns {Promise<IConfirmationMessage>} - A message that confirms the deletion.
   */
  async deleteOrder(
    orderId: number,
    userId: number,
  ): Promise<IConfirmationMessage> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['user'],
      });
      if (!order) throw new NotFoundException('Order not found');
      if (order.user.id !== userId)
        throw new UnauthorizedException('User is not the owner of the order');
      await this.orderRepository.delete(orderId);

      return { message: 'Order deleted successfully' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      if (error.status === HttpStatus.UNAUTHORIZED)
        throw new UnauthorizedException(error.message);
      throw new InternalServerErrorException('Error deleting order');
    }
  }

  /**
   * Confirms an order, we use this method to let the admin confirm an order.
   * @param {number} orderId - The id of the order to be confirmed.
   * @param {number} adminId - The id of the admin who confirms the order.
   * @returns {Promise<IConfirmationMessage>} - A message that confirms the confirmation.
   */
  async confirmOrder(
    orderId: number,
    adminId: number,
  ): Promise<IConfirmationMessage> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });
      if (!order) throw new NotFoundException('Order not found');
      const user = await this.userRepository.findOne({
        where: { id: adminId },
      });
      if (!user) throw new NotFoundException('User not found');
      if (!user.isAdmin)
        throw new UnauthorizedException('User is not an admin');
      await this.orderRepository.update(orderId, { buyConfirmedByAdmin: true });

      return { message: 'Order confirmed successfully' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      if (error.status === HttpStatus.UNAUTHORIZED)
        throw new UnauthorizedException(error.message);
      throw new InternalServerErrorException('Error confirming order');
    }
  }

  /**
   * Cancels an order, we use this method to let the admin cancel an order.
   * @param {number} orderId - The id of the order to be canceled.
   * @param {number} adminId - The id of the admin who cancels the order.
   * @returns {Promise<IConfirmationMessage>} - A message that confirms the cancellation.
   */
  async cancelOrder(
    orderId: number,
    adminId: number,
  ): Promise<IConfirmationMessage> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });
      if (!order) throw new NotFoundException('Order not found');
      const user = await this.userRepository.findOne({
        where: { id: adminId },
      });
      if (!user) throw new NotFoundException('User not found');
      if (!user.isAdmin)
        throw new UnauthorizedException('User is not an admin');
      await this.orderRepository.delete(orderId);

      return { message: 'Order canceled successfully' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(error.message);
      if (error.status === HttpStatus.UNAUTHORIZED)
        throw new UnauthorizedException(error.message);
      throw new InternalServerErrorException('Error canceling order');
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

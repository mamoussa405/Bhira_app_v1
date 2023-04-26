import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class OrderEntity1681663225789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_entity',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'buyerName',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'buyerPhoneNumber',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'shipmentAddress',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'orderTime',
            type: 'timestamp',
          },
          {
            name: 'quantity',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0.0,
          },
          {
            name: 'totalPrice',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0.0,
          },
          {
            name: 'buyConfirmedByUser',
            type: 'boolean',
            default: false,
          },
          {
            name: 'buyConfirmedByAdmin',
            type: 'boolean',
            default: false,
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'productId',
            type: 'int',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user_entity',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['productId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'product_entity',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('order_entity');
  }
}

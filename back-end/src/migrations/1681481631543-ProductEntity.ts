import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ProductEntity1681481631543 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_entity',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'category',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'price',
            type: 'numeric',
            precision: 10,
            scale: 2,
            default: 0.0,
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'stock',
            type: 'numeric',
            precision: 10,
            scale: 2,
            default: 0.0,
          },
          {
            name: 'isNormalProduct',
            type: 'boolean',
            default: true,
          },
          {
            name: 'imagesURL',
            type: 'varchar',
            length: '500',
            isArray: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product_entity');
  }
}

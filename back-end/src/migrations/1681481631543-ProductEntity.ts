import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductEntity1681481631543 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // !important add: "imageURL" VARCHAR(255) NOT NULL
    await queryRunner.query(`
            CREATE TABLE product_entity (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(255) NOT NULL,
                price NUMERIC NOT NULL,
                description VARCHAR(255) NOT NULL,
                stock NUMERIC NOT NULL,
                "isNormalProduct" BOOLEAN NOT NULL
                )
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE product_entity`);
  }
}

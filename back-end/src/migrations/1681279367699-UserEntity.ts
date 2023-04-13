import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEntity1681279367699 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE user_entity (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                "phoneNumber" VARCHAR(255) UNIQUE NOT NULL,
                address VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                "isAdmin" BOOLEAN NOT NULL DEFAULT false,
                "confirmedByAdmin" BOOLEAN NOT NULL DEFAULT false
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user_entity`);
  }
}

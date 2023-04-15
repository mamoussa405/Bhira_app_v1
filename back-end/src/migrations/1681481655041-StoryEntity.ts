import { MigrationInterface, QueryRunner } from 'typeorm';

export class StoryEntity1681481655041 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // !important add: "videoURL" VARCHAR(255) NOT NULL
    await queryRunner.query(`
            CREATE TABLE story_entity (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL
                )
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE story_entity`);
  }
}

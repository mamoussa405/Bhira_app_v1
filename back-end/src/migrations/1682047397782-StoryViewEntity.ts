import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class StoryViewEntity1682047397782 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'story_view_entity',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'storyId',
            type: 'int',
          },
          {
            name: 'viewedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
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
            columnNames: ['storyId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'story_entity',
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('story_view_entity');
  }
}

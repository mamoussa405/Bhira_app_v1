import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserEntity1681279367699 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_entity',
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
            name: 'phoneNumber',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'address',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'isAdmin',
            type: 'boolean',
            default: false,
          },
          {
            name: 'confirmedByAdmin',
            type: 'boolean',
            // !change this to false before production
            default: true,
          },
          {
            name: 'avatarURL',
            type: 'varchar',
            length: '500',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_entity');
  }
}

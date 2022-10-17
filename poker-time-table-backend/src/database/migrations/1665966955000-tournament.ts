import { MigrationInterface, QueryRunner } from 'typeorm';

export class tournament1665966955000 implements MigrationInterface {
  name = 'tournament1665966955000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTE TABLE \`tournament\` ADD \`late_reg_blind_id\` INT(11) NOT NULL DEFAULT 0;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTE TABLE \`tournament\` DROP \`late_reg_blind_id\`;`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class dealers1665714831940 implements MigrationInterface {
  name = 'dealers1665714831940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`dealer\` (
        \`id\` INT(11) NOT NULL AUTO_INCREMENT,
        \`register_date\` DATETIME NOT NULL,
        \`name\` VARCHAR(12) NOT NULL COLLATE 'utf8_general_ci',
        \`tournament_id\` INT(11) NOT NULL DEFAULT '0',
        \`sit_in_time\` DATETIME NULL DEFAULT NULL,
        PRIMARY KEY (\`id\`) USING BTREE,
        UNIQUE INDEX \`IDX_dealer_name\` (\`name\`) USING BTREE
      )
      COLLATE='utf8_general_ci'
      ENGINE=InnoDB;`);

    await queryRunner.query(`
      CREATE TABLE \`dealer_play_log\` (
        \`sit_in_time\` DATETIME NOT NULL,
        \`sit_out_time\` DATETIME NOT NULL,
        \`dealer_id\` INT(11) NOT NULL,
        \`tournament_id\` INT(11) NOT NULL,
        \`play_seconds\` INT(11) NOT NULL,
        PRIMARY KEY (\`sit_in_time\`) USING BTREE
      )
      COLLATE='utf8_general_ci'
      ENGINE=InnoDB;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`dealer\``);
    await queryRunner.query(`DROP TABLE \`dealer_play_log\``);
  }
}

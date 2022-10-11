import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialize1662983601000 implements MigrationInterface {
  name = 'initialize1662983601000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`blind_structure\` (
        \`meta_id\` INT(11) NOT NULL,
        \`level\` INT(11) NOT NULL,
        \`small_blind\` INT(11) NOT NULL,
        \`big_blind\` INT(11) NOT NULL,
        \`minute\` INT(11) NOT NULL,
        PRIMARY KEY (\`meta_id\`, \`level\`) USING BTREE
      )
      COLLATE='utf8_general_ci'
      ENGINE=InnoDB
      ;`,
    );

    await queryRunner.query(
      `CREATE TABLE \`blind_structure_meta\` (
        \`id\` INT(11) NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
        PRIMARY KEY (\`id\`) USING BTREE,
        UNIQUE INDEX \`IDX_5d72b1d265dde0306fa5505699\` (\`name\`) USING BTREE
      )
      COLLATE='utf8_general_ci'
      ENGINE=InnoDB
      AUTO_INCREMENT=28
      ;`,
    );

    await queryRunner.query(
      `CREATE TABLE \`tournament\` (
        \`id\` INT(11) NOT NULL AUTO_INCREMENT,
        \`title\` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
        \`start_datetime\` DATETIME NULL DEFAULT NULL,
        \`end_datetime\` DATETIME NULL DEFAULT NULL,
        \`buyIn\` INT(11) NOT NULL,
        \`level\` INT(11) NOT NULL,
        \`level_start\` DATETIME NULL DEFAULT NULL,
        \`pause_time\` DATETIME NULL DEFAULT NULL,
        \`pause_seconds\` INT(11) NOT NULL,
        PRIMARY KEY (\`id\`) USING BTREE
      )
      COLLATE='utf8_general_ci'
      ENGINE=InnoDB
      AUTO_INCREMENT=27
      ;`,
    );

    await queryRunner.query(
      `CREATE TABLE \`tournament_blind\` (
        \`tournament_id\` INT(11) NOT NULL,
        \`id\` INT(11) NOT NULL,
        \`level\` INT(11) NOT NULL,
        \`small_blind\` INT(11) NOT NULL,
        \`big_blind\` INT(11) NOT NULL,
        \`minute\` INT(11) NOT NULL,
        PRIMARY KEY (\`tournament_id\`, \`id\`) USING BTREE
      )
      COLLATE='utf8_general_ci'
      ENGINE=InnoDB
      ;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`blind_structure\``);
    await queryRunner.query(`DROP TABLE \`blind_structure_meta\``);
    await queryRunner.query(`DROP TABLE \`tournament\``);
    await queryRunner.query(`DROP TABLE \`tournament_blind\``);
  }
}

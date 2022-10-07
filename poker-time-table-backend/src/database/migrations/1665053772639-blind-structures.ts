import { MigrationInterface, QueryRunner } from 'typeorm';

export class blindStructures1665053772639 implements MigrationInterface {
  name = 'blindStructures1665053772639';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `RENAME TABLE \`blind_structure\` TO \`blind_structure_up\``,
    );

    await queryRunner.query(`
        CREATE TABLE \`blind_structure\` (
            \`meta_id\` INT(11) NOT NULL,
            \`id\` INT(11) NOT NULL,
            \`level\` INT(11) NOT NULL,
            \`small_blind\` INT(11) NOT NULL,
            \`big_blind\` INT(11) NOT NULL,
            \`minute\` INT(11) NOT NULL,
            \`ante\` INT(11) NOT NULL,
            PRIMARY KEY (\`meta_id\`, \`id\`) USING BTREE
        )
        COLLATE='utf8_general_ci'
        ENGINE=InnoDB
        ;
    `);

    await queryRunner.query(`
        INSERT INTO \`blind_structure\` (
            \`meta_id\`,
            \`id\`,
            \`level\`,
            \`small_blind\`,
            \`big_blind\`,
            \`minute\`,
            \`ante\`)
        SELECT \`meta_id\`,
               \`level\` AS \`id\`,
               \`level\`,
               \`small_blind\`,
               \`big_blind\`,
               \`minute\`,
               \`ante\`
        FROM \`blind_structure_up\`
    `);

    await queryRunner.query(`DROP TABLE \`blind_structure_up\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `RENAME TABLE \`blind_structure\` TO \`blind_structure_down\``,
    );

    await queryRunner.query(`
        CREATE TABLE \`blind_structure\` (
            \`meta_id\` INT(11) NOT NULL,
            \`level\` INT(11) NOT NULL,
            \`small_blind\` INT(11) NOT NULL,
            \`big_blind\` INT(11) NOT NULL,
            \`minute\` INT(11) NOT NULL,
            \`ante\` INT(11) NOT NULL,
            PRIMARY KEY (\`meta_id\`, \`level\`) USING BTREE
        )
        COLLATE='utf8_general_ci'
        ENGINE=InnoDB
        ;
    `);

    await queryRunner.query(`
        INSERT INTO \`blind_structure\` (
            \`meta_id\`,
            \`level\`,
            \`small_blind\`,
            \`big_blind\`,
            \`minute\`,
            \`ante\`)
        SELECT \`meta_id\`,
               \`level\`,
               \`small_blind\`,
               \`big_blind\`,
               \`minute\`,
               \`ante\`
        FROM \`blind_structure_down\`
        WHERE \`level\` > 0
    `);

    await queryRunner.query(`DROP TABLE \`blind_structure_down\``);
  }
}

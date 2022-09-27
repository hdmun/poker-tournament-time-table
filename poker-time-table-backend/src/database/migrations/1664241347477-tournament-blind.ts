import { MigrationInterface, QueryRunner } from "typeorm";

export class tournamentBlind1664241347477 implements MigrationInterface {
    name = 'tournamentBlind1664241347477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blind_structure\` ADD \`ante\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tournament_blind\` ADD \`ante\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tournament\` CHANGE \`start_datetime\` \`start_datetime\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`tournament\` CHANGE \`end_datetime\` \`end_datetime\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`tournament\` CHANGE \`level_start\` \`level_start\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`tournament\` CHANGE \`pause_time\` \`pause_time\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tournament\` CHANGE \`pause_time\` \`pause_time\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`tournament\` CHANGE \`level_start\` \`level_start\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`tournament\` CHANGE \`end_datetime\` \`end_datetime\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`tournament\` CHANGE \`start_datetime\` \`start_datetime\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`tournament_blind\` DROP COLUMN \`ante\``);
        await queryRunner.query(`ALTER TABLE \`blind_structure\` DROP COLUMN \`ante\``);
    }

}

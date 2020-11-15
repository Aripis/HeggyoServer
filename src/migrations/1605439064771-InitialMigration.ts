import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1605439064771 implements MigrationInterface {
    name = 'InitialMigration1605439064771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `institution` ADD `tokenStatus` enum ('0', '1') NOT NULL DEFAULT '0'");
        await queryRunner.query("ALTER TABLE `institution` ADD `token` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `institution` DROP COLUMN `token`");
        await queryRunner.query("ALTER TABLE `institution` DROP COLUMN `tokenStatus`");
    }

}

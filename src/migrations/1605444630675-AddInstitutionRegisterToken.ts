import {MigrationInterface, QueryRunner} from "typeorm";

export class AddInstitutionRegisterToken1605444630675 implements MigrationInterface {
    name = 'AddInstitutionRegisterToken1605444630675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD `registerToken` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `student` ADD `registerToken` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `teacher` ADD `registerToken` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `teacher` DROP COLUMN `registerToken`");
        await queryRunner.query("ALTER TABLE `student` DROP COLUMN `registerToken`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `registerToken`");
    }

}

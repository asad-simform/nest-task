import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarUrl1783512381497 implements MigrationInterface {
    name = 'AddAvatarUrl1783512381497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarUrl"`);
    }

}

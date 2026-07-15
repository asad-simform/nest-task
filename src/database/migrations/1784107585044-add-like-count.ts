import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLikeCount1784107585044 implements MigrationInterface {
    name = 'AddLikeCount1784107585044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "likeCounts" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "likeCounts"`);
    }

}

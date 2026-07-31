import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCaptionToPost1784005495280 implements MigrationInterface {
    name = 'AddCaptionToPost1784005495280';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "post" ADD "caption" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "post" ADD "thumbnailUrl" character varying`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "post" DROP COLUMN "thumbnailUrl"`,
        );
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "caption"`);
    }
}

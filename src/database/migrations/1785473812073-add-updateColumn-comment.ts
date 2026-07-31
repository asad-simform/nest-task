import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUpdateColumnComment1785473812073 implements MigrationInterface {
    name = 'AddUpdateColumnComment1785473812073';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "comment" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "comment" DROP COLUMN "updatedAt"`,
        );
    }
}

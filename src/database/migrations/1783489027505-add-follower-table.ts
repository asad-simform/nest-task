import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFollowerTable1783489027505 implements MigrationInterface {
    name = 'AddFollowerTable1783489027505';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."follower_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`,
        );
        await queryRunner.query(
            `CREATE TABLE "follower" ("id" SERIAL NOT NULL, "status" "public"."follower_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "follower_id" integer, "following_id" integer, CONSTRAINT "UQ_70cf693aa3bb4e2a196c89638a7" UNIQUE ("follower_id", "following_id"), CONSTRAINT "PK_69e733c097e58ee41a00ccb02d5" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD "isPrivate" boolean NOT NULL DEFAULT false`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ALTER COLUMN "tokenVersion" SET DEFAULT '1'`,
        );
        await queryRunner.query(
            `ALTER TABLE "follower" ADD CONSTRAINT "FK_c39c716bcdda7f17adcfe4643ad" FOREIGN KEY ("follower_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "follower" ADD CONSTRAINT "FK_07301dde24966bb953f6749780d" FOREIGN KEY ("following_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "follower" DROP CONSTRAINT "FK_07301dde24966bb953f6749780d"`,
        );
        await queryRunner.query(
            `ALTER TABLE "follower" DROP CONSTRAINT "FK_c39c716bcdda7f17adcfe4643ad"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ALTER COLUMN "tokenVersion" SET DEFAULT '0'`,
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isPrivate"`);
        await queryRunner.query(`DROP TABLE "follower"`);
        await queryRunner.query(`DROP TYPE "public"."follower_status_enum"`);
    }
}

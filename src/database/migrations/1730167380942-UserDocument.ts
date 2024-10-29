import { MigrationInterface, QueryRunner } from "typeorm";

export class UserDocument1730167380942 implements MigrationInterface {
    name = 'UserDocument1730167380942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "document" character varying(14)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "document"`);
    }
}

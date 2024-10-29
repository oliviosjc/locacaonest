import { MigrationInterface, QueryRunner } from "typeorm";

export class UserStatus1730156384297 implements MigrationInterface {
    name = 'UserStatus1730156384297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'FREE_TRIAL_PERIOD', 'FREE_TRIAL_PERIOD_EXPIRED', 'SUBSCRIPTION_CANCELLED', 'SUBSCRIPTION_EXPIRED', 'WAITING_FOR_PAYMENT', 'BLOCKED')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "status" "public"."users_status_enum" DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1730037537497 implements MigrationInterface {
    name = 'InitialMigration1730037537497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying(128) NOT NULL, "updatedBy" character varying(128), "actived" boolean NOT NULL DEFAULT true, "socialName" character varying(128) NOT NULL, "fantasyName" character varying(128) NOT NULL, "document" character varying(14) NOT NULL, "ownerId" uuid, CONSTRAINT "UQ_13496c970093729e7ab04eb7da4" UNIQUE ("document"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying(128) NOT NULL, "updatedBy" character varying(128), "actived" boolean NOT NULL DEFAULT true, "fullName" character varying(128) NOT NULL, "email" character varying(128) NOT NULL, "password" character varying NOT NULL, "ownerId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menu_item_features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "handler" character varying(64) NOT NULL, "menuItemId" uuid, CONSTRAINT "UQ_d7cf84591c4037888441a049746" UNIQUE ("name"), CONSTRAINT "UQ_eae890e9962cb413313f0428b3d" UNIQUE ("handler"), CONSTRAINT "PK_8a24678d5a7745168771ad11a2b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menus" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "icon" character varying(64) NOT NULL, "link" character varying(64), "order" integer NOT NULL DEFAULT '0', "parentId" uuid, CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group_menu_item_features" ("groupId" uuid NOT NULL, "menuItemId" uuid NOT NULL, "menuItemFeatureId" uuid NOT NULL, CONSTRAINT "PK_0c7d876288db22a082fcd98144c" PRIMARY KEY ("groupId", "menuItemId", "menuItemFeatureId"))`);
        await queryRunner.query(`CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying(128) NOT NULL, "updatedBy" character varying(128), "actived" boolean NOT NULL DEFAULT true, "name" character varying(128) NOT NULL, "parentGroupId" uuid, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "companies_user_groups" ("companyId" uuid NOT NULL, "userId" uuid NOT NULL, "groupId" uuid NOT NULL, CONSTRAINT "PK_374a45f2cebd7c49ac60ad1c5e7" PRIMARY KEY ("companyId", "userId", "groupId"))`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_6dcdcbb7d72f64602307ec4ab39" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_d047f0b6c43f85848c0b8c54276" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_item_features" ADD CONSTRAINT "FK_c636ffa8015de466366ab794f81" FOREIGN KEY ("menuItemId") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menus" ADD CONSTRAINT "FK_8523e13f1ba719e16eb474657ec" FOREIGN KEY ("parentId") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_menu_item_features" ADD CONSTRAINT "FK_fd0e43a0fb14e9d8fce8c776008" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_menu_item_features" ADD CONSTRAINT "FK_752e64d6771df89e163d10f2ad7" FOREIGN KEY ("menuItemId") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_menu_item_features" ADD CONSTRAINT "FK_ea8c4fcc2d684efbed8fd46bb46" FOREIGN KEY ("menuItemFeatureId") REFERENCES "menu_item_features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_df0d0b85eee65b9064b8e21a837" FOREIGN KEY ("parentGroupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companies_user_groups" ADD CONSTRAINT "FK_4321210d0421f8f8d25e3c7ac2e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companies_user_groups" ADD CONSTRAINT "FK_3a487e52787be85ab82f9866451" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companies_user_groups" ADD CONSTRAINT "FK_347a5a3a0127823ad40fc07ae97" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies_user_groups" DROP CONSTRAINT "FK_347a5a3a0127823ad40fc07ae97"`);
        await queryRunner.query(`ALTER TABLE "companies_user_groups" DROP CONSTRAINT "FK_3a487e52787be85ab82f9866451"`);
        await queryRunner.query(`ALTER TABLE "companies_user_groups" DROP CONSTRAINT "FK_4321210d0421f8f8d25e3c7ac2e"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_df0d0b85eee65b9064b8e21a837"`);
        await queryRunner.query(`ALTER TABLE "group_menu_item_features" DROP CONSTRAINT "FK_ea8c4fcc2d684efbed8fd46bb46"`);
        await queryRunner.query(`ALTER TABLE "group_menu_item_features" DROP CONSTRAINT "FK_752e64d6771df89e163d10f2ad7"`);
        await queryRunner.query(`ALTER TABLE "group_menu_item_features" DROP CONSTRAINT "FK_fd0e43a0fb14e9d8fce8c776008"`);
        await queryRunner.query(`ALTER TABLE "menus" DROP CONSTRAINT "FK_8523e13f1ba719e16eb474657ec"`);
        await queryRunner.query(`ALTER TABLE "menu_item_features" DROP CONSTRAINT "FK_c636ffa8015de466366ab794f81"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_d047f0b6c43f85848c0b8c54276"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_6dcdcbb7d72f64602307ec4ab39"`);
        await queryRunner.query(`DROP TABLE "companies_user_groups"`);
        await queryRunner.query(`DROP TABLE "groups"`);
        await queryRunner.query(`DROP TABLE "group_menu_item_features"`);
        await queryRunner.query(`DROP TABLE "menus"`);
        await queryRunner.query(`DROP TABLE "menu_item_features"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "companies"`);
    }

}

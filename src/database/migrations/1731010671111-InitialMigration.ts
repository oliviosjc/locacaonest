import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1731010671111 implements MigrationInterface {
    name = 'InitialMigration1731010671111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying(128) NOT NULL, "updatedBy" character varying(128), "actived" boolean NOT NULL DEFAULT true, "socialName" character varying(128) NOT NULL, "fantasyName" character varying(128) NOT NULL, "document" character varying(14) NOT NULL, "ownerId" uuid, CONSTRAINT "UQ_13496c970093729e7ab04eb7da4" UNIQUE ("document"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menu_item_features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "handler" character varying(64) NOT NULL, "menuItemId" uuid, CONSTRAINT "UQ_d7cf84591c4037888441a049746" UNIQUE ("name"), CONSTRAINT "UQ_eae890e9962cb413313f0428b3d" UNIQUE ("handler"), CONSTRAINT "PK_8a24678d5a7745168771ad11a2b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menus" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "icon" character varying(64) NOT NULL, "link" character varying(64), "order" integer NOT NULL DEFAULT '0', "parentId" uuid, CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group_menu_item_features" ("groupId" uuid NOT NULL, "menuItemId" uuid NOT NULL, "menuItemFeatureId" uuid NOT NULL, CONSTRAINT "PK_0c7d876288db22a082fcd98144c" PRIMARY KEY ("groupId", "menuItemId", "menuItemFeatureId"))`);
        await queryRunner.query(`CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying(128) NOT NULL, "updatedBy" character varying(128), "actived" boolean NOT NULL DEFAULT true, "name" character varying(128) NOT NULL, "root" boolean NOT NULL, "parentGroupId" uuid, "ownerId" uuid, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "model_category_technical_information_answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying(32) NOT NULL, "categoryTechnicalInformationId" uuid, "modelId" uuid, CONSTRAINT "PK_c6e1fe1179cef120583f710d5fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categorys_technical_informations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fieldType" "public"."categorys_technical_informations_fieldtype_enum" NOT NULL DEFAULT 'text', "key" character varying(128) NOT NULL, "required" boolean NOT NULL DEFAULT false, "order" integer NOT NULL DEFAULT '0', "categoryId" uuid, CONSTRAINT "PK_77115b2f4842378d0a1b05ba582" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying(128) NOT NULL, "updatedBy" character varying(128), "actived" boolean NOT NULL DEFAULT true, "name" character varying(128) NOT NULL, "description" character varying(128) NOT NULL, "ownerId" uuid, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "models" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying(128) NOT NULL, "updatedBy" character varying(128), "actived" boolean NOT NULL DEFAULT true, "name" character varying(128) NOT NULL, "description" character varying(128) NOT NULL, "image" character varying(128), "brandId" uuid, "categoryId" uuid, "ownerId" uuid, CONSTRAINT "PK_ef9ed7160ea69013636466bf2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying(128) NOT NULL, "updatedBy" character varying(128), "actived" boolean NOT NULL DEFAULT true, "name" character varying(128) NOT NULL, "description" character varying(128) NOT NULL, "image" character varying(512), "ownerId" uuid, CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(128) NOT NULL, "position" character varying(128) NOT NULL, "whatsapp" character varying(128), "email" character varying(128), "systemCommunication" boolean NOT NULL DEFAULT false, "customerId" uuid, CONSTRAINT "UQ_c89a44a8c97a58f794b691b29fa" UNIQUE ("whatsapp"), CONSTRAINT "UQ_0713697ae61022c01799ed5d09d" UNIQUE ("email"), CONSTRAINT "PK_bde619dbcb45a3e4d542e137bd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "alias" character varying(128) NOT NULL, "address" character varying(128) NOT NULL, "city" character varying(128) NOT NULL, "complement" character varying(64), "state" character varying(64) NOT NULL, "zipCode" character varying(8) NOT NULL, "neighborhood" character varying(128) NOT NULL, "number" character varying(5) NOT NULL, "reference" character varying(128), "customerId" uuid, CONSTRAINT "UQ_2ca7a2a3bfb669ffd58afece9b7" UNIQUE ("alias"), CONSTRAINT "PK_336bda7b0a0cd04241f719fc834" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_document_configurations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(128) NOT NULL, "order" integer NOT NULL, "required" boolean NOT NULL, "ownerId" uuid, CONSTRAINT "PK_573678b89b14cac93354e66694f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying(128) NOT NULL, "extension" character varying(128) NOT NULL, "s3Path" character varying(1024) NOT NULL, "customerId" uuid, "customerDocumentConfigurationId" uuid, CONSTRAINT "PK_ccc82daa515b50e68a76f343417" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying(128) NOT NULL, "updatedBy" character varying(128), "actived" boolean NOT NULL DEFAULT true, "name" character varying(128) NOT NULL, "document" character varying(14) NOT NULL, "ownerId" uuid, CONSTRAINT "UQ_68c9c024a07c49ad6a2072d23c6" UNIQUE ("document"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying(128) NOT NULL, "updatedBy" character varying(128), "actived" boolean NOT NULL DEFAULT true, "fullName" character varying(128) NOT NULL, "email" character varying(128) NOT NULL, "password" character varying NOT NULL, "status" "public"."users_status_enum" DEFAULT 'ACTIVE', "subscriptionPlan" "public"."users_subscriptionplan_enum", "subscriptionPeriod" "public"."users_subscriptionperiod_enum", "document" character varying(14), "subscriptionStartDate" TIMESTAMP, "subscriptionEndDate" TIMESTAMP, "ownerId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "companies_user_groups" ("companyId" uuid NOT NULL, "userId" uuid NOT NULL, "groupId" uuid NOT NULL, CONSTRAINT "PK_374a45f2cebd7c49ac60ad1c5e7" PRIMARY KEY ("companyId", "userId", "groupId"))`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_6dcdcbb7d72f64602307ec4ab39" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_item_features" ADD CONSTRAINT "FK_c636ffa8015de466366ab794f81" FOREIGN KEY ("menuItemId") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menus" ADD CONSTRAINT "FK_8523e13f1ba719e16eb474657ec" FOREIGN KEY ("parentId") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_menu_item_features" ADD CONSTRAINT "FK_fd0e43a0fb14e9d8fce8c776008" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_menu_item_features" ADD CONSTRAINT "FK_752e64d6771df89e163d10f2ad7" FOREIGN KEY ("menuItemId") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_menu_item_features" ADD CONSTRAINT "FK_ea8c4fcc2d684efbed8fd46bb46" FOREIGN KEY ("menuItemFeatureId") REFERENCES "menu_item_features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_df0d0b85eee65b9064b8e21a837" FOREIGN KEY ("parentGroupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_4d8d8897aef1c049336d8dde13f" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "model_category_technical_information_answers" ADD CONSTRAINT "FK_a6f0cccac4dfc76a445b610f07f" FOREIGN KEY ("categoryTechnicalInformationId") REFERENCES "categorys_technical_informations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "model_category_technical_information_answers" ADD CONSTRAINT "FK_66a4e4c99819a7156ffcc72d678" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categorys_technical_informations" ADD CONSTRAINT "FK_8035ff607d67138c2ada9640252" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_5693ea772e9d87a3c552101b832" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "models" ADD CONSTRAINT "FK_1f36b4eb435f410c6749378cf8c" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "models" ADD CONSTRAINT "FK_b82525ba9427394699a0f25d757" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "models" ADD CONSTRAINT "FK_87d13f591f17b2b381172ea602c" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "brands" ADD CONSTRAINT "FK_b73dd7df94b0a92f5419eb8705a" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_contacts" ADD CONSTRAINT "FK_d8275ed306525c0d1cddcaee904" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" ADD CONSTRAINT "FK_7bd088b1c8d3506953240ebf030" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_document_configurations" ADD CONSTRAINT "FK_cb36f4865241b7e9b9ee9b1bf07" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_documents" ADD CONSTRAINT "FK_831b9575ae0e77515c9751feeb0" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_documents" ADD CONSTRAINT "FK_f3a9610b937ea8071690fc11c7a" FOREIGN KEY ("customerDocumentConfigurationId") REFERENCES "customer_document_configurations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_e272f7a6dd948d44fe4ea097452" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_d047f0b6c43f85848c0b8c54276" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companies_user_groups" ADD CONSTRAINT "FK_4321210d0421f8f8d25e3c7ac2e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companies_user_groups" ADD CONSTRAINT "FK_3a487e52787be85ab82f9866451" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companies_user_groups" ADD CONSTRAINT "FK_347a5a3a0127823ad40fc07ae97" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies_user_groups" DROP CONSTRAINT "FK_347a5a3a0127823ad40fc07ae97"`);
        await queryRunner.query(`ALTER TABLE "companies_user_groups" DROP CONSTRAINT "FK_3a487e52787be85ab82f9866451"`);
        await queryRunner.query(`ALTER TABLE "companies_user_groups" DROP CONSTRAINT "FK_4321210d0421f8f8d25e3c7ac2e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_d047f0b6c43f85848c0b8c54276"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_e272f7a6dd948d44fe4ea097452"`);
        await queryRunner.query(`ALTER TABLE "customer_documents" DROP CONSTRAINT "FK_f3a9610b937ea8071690fc11c7a"`);
        await queryRunner.query(`ALTER TABLE "customer_documents" DROP CONSTRAINT "FK_831b9575ae0e77515c9751feeb0"`);
        await queryRunner.query(`ALTER TABLE "customer_document_configurations" DROP CONSTRAINT "FK_cb36f4865241b7e9b9ee9b1bf07"`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" DROP CONSTRAINT "FK_7bd088b1c8d3506953240ebf030"`);
        await queryRunner.query(`ALTER TABLE "customer_contacts" DROP CONSTRAINT "FK_d8275ed306525c0d1cddcaee904"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP CONSTRAINT "FK_b73dd7df94b0a92f5419eb8705a"`);
        await queryRunner.query(`ALTER TABLE "models" DROP CONSTRAINT "FK_87d13f591f17b2b381172ea602c"`);
        await queryRunner.query(`ALTER TABLE "models" DROP CONSTRAINT "FK_b82525ba9427394699a0f25d757"`);
        await queryRunner.query(`ALTER TABLE "models" DROP CONSTRAINT "FK_1f36b4eb435f410c6749378cf8c"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_5693ea772e9d87a3c552101b832"`);
        await queryRunner.query(`ALTER TABLE "categorys_technical_informations" DROP CONSTRAINT "FK_8035ff607d67138c2ada9640252"`);
        await queryRunner.query(`ALTER TABLE "model_category_technical_information_answers" DROP CONSTRAINT "FK_66a4e4c99819a7156ffcc72d678"`);
        await queryRunner.query(`ALTER TABLE "model_category_technical_information_answers" DROP CONSTRAINT "FK_a6f0cccac4dfc76a445b610f07f"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_4d8d8897aef1c049336d8dde13f"`);
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_df0d0b85eee65b9064b8e21a837"`);
        await queryRunner.query(`ALTER TABLE "group_menu_item_features" DROP CONSTRAINT "FK_ea8c4fcc2d684efbed8fd46bb46"`);
        await queryRunner.query(`ALTER TABLE "group_menu_item_features" DROP CONSTRAINT "FK_752e64d6771df89e163d10f2ad7"`);
        await queryRunner.query(`ALTER TABLE "group_menu_item_features" DROP CONSTRAINT "FK_fd0e43a0fb14e9d8fce8c776008"`);
        await queryRunner.query(`ALTER TABLE "menus" DROP CONSTRAINT "FK_8523e13f1ba719e16eb474657ec"`);
        await queryRunner.query(`ALTER TABLE "menu_item_features" DROP CONSTRAINT "FK_c636ffa8015de466366ab794f81"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_6dcdcbb7d72f64602307ec4ab39"`);
        await queryRunner.query(`DROP TABLE "companies_user_groups"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "customer_documents"`);
        await queryRunner.query(`DROP TABLE "customer_document_configurations"`);
        await queryRunner.query(`DROP TABLE "customer_addresses"`);
        await queryRunner.query(`DROP TABLE "customer_contacts"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP TABLE "models"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "categorys_technical_informations"`);
        await queryRunner.query(`DROP TABLE "model_category_technical_information_answers"`);
        await queryRunner.query(`DROP TABLE "groups"`);
        await queryRunner.query(`DROP TABLE "group_menu_item_features"`);
        await queryRunner.query(`DROP TABLE "menus"`);
        await queryRunner.query(`DROP TABLE "menu_item_features"`);
        await queryRunner.query(`DROP TABLE "companies"`);
    }

}

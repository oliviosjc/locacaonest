import { MigrationInterface, QueryRunner } from "typeorm";

export class Backoffice1730217774235 implements MigrationInterface {
    name = 'Backoffice1730217774235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying(128) NOT NULL, "updatedBy" character varying(128), "actived" boolean NOT NULL DEFAULT true, "name" character varying(128) NOT NULL, "description" character varying(128) NOT NULL, "ownerId" uuid, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "models" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying(128) NOT NULL, "updatedBy" character varying(128), "actived" boolean NOT NULL DEFAULT true, "name" character varying(128) NOT NULL, "description" character varying(128) NOT NULL, "image" character varying(128), "brandId" uuid, "categoryId" uuid, "ownerId" uuid, CONSTRAINT "PK_ef9ed7160ea69013636466bf2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying(128) NOT NULL, "updatedBy" character varying(128), "actived" boolean NOT NULL DEFAULT true, "name" character varying(128) NOT NULL, "description" character varying(128) NOT NULL, "image" character varying(512), "ownerId" uuid, CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(128) NOT NULL, "position" character varying(128) NOT NULL, "whatsapp" character varying(128), "email" character varying(128), "systemCommunication" boolean NOT NULL DEFAULT false, "customerId" uuid, CONSTRAINT "UQ_c89a44a8c97a58f794b691b29fa" UNIQUE ("whatsapp"), CONSTRAINT "UQ_0713697ae61022c01799ed5d09d" UNIQUE ("email"), CONSTRAINT "PK_bde619dbcb45a3e4d542e137bd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address" character varying(128) NOT NULL, "city" character varying(128) NOT NULL, "complement" character varying(64), "state" character varying(64) NOT NULL, "zipCode" character varying(8) NOT NULL, "neighborhood" character varying(128) NOT NULL, "number" character varying(5) NOT NULL, "reference" character varying(128), "customerId" uuid, CONSTRAINT "PK_336bda7b0a0cd04241f719fc834" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying(128) NOT NULL, "updatedBy" character varying(128), "actived" boolean NOT NULL DEFAULT true, "name" character varying(128) NOT NULL, "document" character varying(14) NOT NULL, CONSTRAINT "UQ_68c9c024a07c49ad6a2072d23c6" UNIQUE ("document"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);       
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_5693ea772e9d87a3c552101b832" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "models" ADD CONSTRAINT "FK_1f36b4eb435f410c6749378cf8c" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "models" ADD CONSTRAINT "FK_b82525ba9427394699a0f25d757" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "models" ADD CONSTRAINT "FK_87d13f591f17b2b381172ea602c" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "brands" ADD CONSTRAINT "FK_b73dd7df94b0a92f5419eb8705a" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_contacts" ADD CONSTRAINT "FK_d8275ed306525c0d1cddcaee904" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_addresses" ADD CONSTRAINT "FK_7bd088b1c8d3506953240ebf030" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_addresses" DROP CONSTRAINT "FK_7bd088b1c8d3506953240ebf030"`);
        await queryRunner.query(`ALTER TABLE "customer_contacts" DROP CONSTRAINT "FK_d8275ed306525c0d1cddcaee904"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP CONSTRAINT "FK_b73dd7df94b0a92f5419eb8705a"`);
        await queryRunner.query(`ALTER TABLE "models" DROP CONSTRAINT "FK_87d13f591f17b2b381172ea602c"`);
        await queryRunner.query(`ALTER TABLE "models" DROP CONSTRAINT "FK_b82525ba9427394699a0f25d757"`);
        await queryRunner.query(`ALTER TABLE "models" DROP CONSTRAINT "FK_1f36b4eb435f410c6749378cf8c"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_5693ea772e9d87a3c552101b832"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "customer_addresses"`);
        await queryRunner.query(`DROP TABLE "customer_contacts"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP TABLE "models"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}

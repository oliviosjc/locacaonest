import { MigrationInterface, QueryRunner } from "typeorm";

export class UserDocument1730283794891 implements MigrationInterface {
    name = 'UserDocument1730283794891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "customer_document_configurations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(128) NOT NULL,
                "order" integer NOT NULL,
                "required" boolean NOT NULL,
                "ownerId" uuid,
                CONSTRAINT "PK_573678b89b14cac93354e66694f" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "customer_documents" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "filename" character varying(128) NOT NULL,
                "extension" character varying(128) NOT NULL,
                "s3Path" character varying(1024) NOT NULL,
                "customerId" uuid,
                "customerDocumentConfigurationId" uuid,
                CONSTRAINT "PK_ccc82daa515b50e68a76f343417" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "customer_document_configurations"
            ADD CONSTRAINT "FK_cb36f4865241b7e9b9ee9b1bf07" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "customer_documents"
            ADD CONSTRAINT "FK_831b9575ae0e77515c9751feeb0" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "customer_documents"
            ADD CONSTRAINT "FK_f3a9610b937ea8071690fc11c7a" FOREIGN KEY ("customerDocumentConfigurationId") REFERENCES "customer_document_configurations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "customer_documents" DROP CONSTRAINT "FK_f3a9610b937ea8071690fc11c7a"
        `);
        await queryRunner.query(`
            ALTER TABLE "customer_documents" DROP CONSTRAINT "FK_831b9575ae0e77515c9751feeb0"
        `);
        await queryRunner.query(`
            ALTER TABLE "customer_document_configurations" DROP CONSTRAINT "FK_cb36f4865241b7e9b9ee9b1bf07"
        `);
        await queryRunner.query(`
            DROP TABLE "customer_documents"
        `);
        await queryRunner.query(`
            DROP TABLE "customer_document_configurations"
        `);
    }

}

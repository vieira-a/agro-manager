import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDefaultTables1749860716721 implements MigrationInterface {
    name = 'CreateDefaultTables1749860716721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "crops" ("id" uuid NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_098dbeb7c803dc7c08a7f02b805" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "harvests" ("id" uuid NOT NULL, "description" character varying NOT NULL, "year" integer NOT NULL, "farmId" uuid, "cropId" uuid, CONSTRAINT "PK_fb748ae28bc0000875b1949a0a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "farms" ("id" uuid NOT NULL, "name" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "totalArea" double precision NOT NULL, "agriculturalArea" double precision NOT NULL, "vegetationArea" double precision NOT NULL, "producerId" uuid, CONSTRAINT "PK_39aff9c35006b14025bba5a43d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "producers" ("id" uuid NOT NULL, "name" character varying NOT NULL, "document" character varying NOT NULL, CONSTRAINT "PK_7f16886d1a44ed0974232b82506" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "harvests" ADD CONSTRAINT "FK_1a1b3f03ae8fcad1ba5b46bae3a" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "harvests" ADD CONSTRAINT "FK_e849e688de0a0119e0cff46234d" FOREIGN KEY ("cropId") REFERENCES "crops"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "farms" ADD CONSTRAINT "FK_a47fa1b0ccf320f4028705ca3dd" FOREIGN KEY ("producerId") REFERENCES "producers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farms" DROP CONSTRAINT "FK_a47fa1b0ccf320f4028705ca3dd"`);
        await queryRunner.query(`ALTER TABLE "harvests" DROP CONSTRAINT "FK_e849e688de0a0119e0cff46234d"`);
        await queryRunner.query(`ALTER TABLE "harvests" DROP CONSTRAINT "FK_1a1b3f03ae8fcad1ba5b46bae3a"`);
        await queryRunner.query(`DROP TABLE "producers"`);
        await queryRunner.query(`DROP TABLE "farms"`);
        await queryRunner.query(`DROP TABLE "harvests"`);
        await queryRunner.query(`DROP TABLE "crops"`);
    }

}

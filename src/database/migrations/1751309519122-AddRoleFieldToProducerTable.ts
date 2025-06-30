import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleFieldToProducerTable1751309519122 implements MigrationInterface {
    name = 'AddRoleFieldToProducerTable1751309519122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producers" ADD "role" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producers" DROP COLUMN "role"`);
    }

}

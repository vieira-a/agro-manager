import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordFieldToProducerTable1751052626294 implements MigrationInterface {
    name = 'AddPasswordFieldToProducerTable1751052626294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producers" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producers" DROP COLUMN "password"`);
    }

}

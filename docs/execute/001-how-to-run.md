# Executando o projeto Agro Manager

## Ambiente local

### Requisitos

- Node.js >= 18.x (recomendo LTS)
- npm
- PostgreSQL >= 13.x configurado e rodando localmente ou em container
- TypeScript (instalado via dependências)
- ts-node (instalado via dependências)
- Variáveis de ambiente configuradas no arquivo .env.development.local

### Configuração das variáveis de ambiente

Crie o arquivo `.env.development.local` na raiz do projeto com as variáveis abaixo:

```json
NODE_ENV=development
POSTGRES_DB_HOST=localhost
POSTGRES_DB_PORT=5432
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB_NAME=nome_do_banco
```

Ajuste os valores conforme seu ambiente

### Como rodar o projeto

#### Instalar dependências

```bash
npm install
```

#### Rodar migrações no ambiente de desenvolvimento

```bash
npm run migration:run:dev
```

Esse comando executa as migrações utilizando o arquivo src/database/data-source.ts que exporta a instância do DataSource configurada para desenvolvimento.

#### Iniciar o projeto em modo de desenvolvimento

```bash
npm run start:dev
```

Esse comando usa o ts-node para rodar a aplicação com recarregamento automático.

### Estrutura importante para configurações

- As entidades estão localizadas em: src/**/*.entity.ts
- As migrações estão em: database/migrations/*.ts
- A configuração do TypeORM está em: src/database/typeorm.config.ts
- A instância do DataSource para CLI está em: src/database/data-source.ts

### Observações

- As migrations e as entidades usam arquivos .ts no ambiente de desenvolvimento e arquivos compilados .js na produção.
- Nunca rode a aplicação em produção com synchronize: true para evitar perda de dados.
- Use os comandos do TypeORM CLI sempre apontando para o arquivo que exporta a instância do DataSource (data-source.ts).

#### Gerando novas migrações 

Utilize a sintaxe a seguir:

- Ambiente de desenvolvimento: `npm run migration:generate:dev -- database/migrations/TituloMigracao`
- Ambiente de produção: `npm run migration:generate:prod -- database/migrations/TituloMigracao`

Se precisar de ajuda para configurar ou rodar algum comando, só avisar! 

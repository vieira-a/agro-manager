# Executando o projeto Agro Manager

## Ambiente local

### Requisitos

- Node.js >= 18.x (recomendo LTS)
- npm
- Git
- PostgreSQL >= 13.x configurado e rodando localmente ou em container
- Docker e Docker Compose
- TypeScript (instalado via dependências)
- ts-node (instalado via dependências)
- Variáveis de ambiente configuradas no arquivo .env.development.local

---

### Clone o repositório

```bash
git clone git@github.com:vieira-a/agro-manager.git
```

### Configuração das variáveis de ambiente

Renomeie o arquivo `env-example` que está na raiz do projeto, para `.env.development.local`, e preencha as seguintes variáveis de ambiente:

```json
API_VERSION=v1
NODE_ENV=development
POSTGRES_DB_HOST=localhost
POSTGRES_DB_PORT=5432
POSTGRES_DB_NAME=nome_banco
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB_NAME=nome_do_banco
PGADMIN_EMAIL=email_valido
PGADMIN_PASSWORD=senha
JWT_TOKEN_SECRET=jwtTokenSecretExample
JWT_REFRESH_TOKEN_SECRET=jwtRefreshTokenSecretExample
```

Ajuste os valores conforme seu ambiente

---

### Como rodar o projeto

#### Instalar dependências

```bash
npm install
```

#### Banco de dados

Antes de rodar a aplicação, suba o banco PostgreSQL com o seguinte comando Docker:

```bash
docker-compose up -d
```

Este comando irá executar o arquivo `docker-compose.yml` que está na raiz do projeto. Este arquivo utiliza variáveis de ambiente para configurar a instância do banco de dados `Postgres` e o `PgAdmin`.

_Caso já tenha esses recursos instalados, não precisa executar o docker, basta criar uma nova base de dados e informar no arquivo `.env.development.local`
Ao subir o Docker, o banco será criado automaticamente com os dados fornecidos em `.env.development.local`._

Se quiser gerenciar o banco visualmente, acesse o **pgAdmin**:

- URL: http://localhost:8080 (ou a porta informada no arquivo `.env.development.local`)
- Email: conforme `PGADMIN_EMAIL` no arquivo `.env.development.local`
- Senha: conforme `PGADMIN_PASSWORD` no arquivo `.env.development.local`

Dentro do pgAdmin, conecte-se ao servidor `postgres` e seu banco com o nome informado no arquivo `.env.development.local` estará disponível automaticamente, sem necessidade de criação manual.

Caso ainda não apareça:

1. Clique com o botão direito em "Servers" > Create > Server...
2. Configure com:
   - **Name:** agro-manager-local
   - **Host:** postgres
   - **Port:** 5432
   - **Username:** conforme `.env.development.local`
   - **Password:** conforme `.env.development.local`

---

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

---

### Executando testes unitários e de integração

```bash
npm run test
```

### Executando testes e2e

```bash
npm run test:e2e
```

Este comando executará uma suite de testes que abrange as principais camadas e funcionalidades, contendo:

##### Camada de Domínio

**Producer (Produtor)**

- [x] Deve criar um produtor válido com CPF válido e todas as entidades aninhadas (fazendas, safras, culturas).
- [x] Deve permitir adicionar uma fazenda a um produtor existente.
- [x] Deve criar um produtor com documento CNPJ válido e fazenda.
- [x] Deve lançar uma exceção ao tentar adicionar uma fazenda inválida (null).
- [x] Deve lançar uma exceção se o nome do produtor for vazio.
- [x] Deve lançar uma exceção se o documento do produtor for nulo.
- [x] Deve lançar uma exceção se o documento do produtor for indefinido.

**Farm (Fazenda)**

- [x] Deve criar uma fazenda com sucesso usando dados válidos.
- [x] Não deve duplicar a mesma safra ao adicioná-la novamente.
- [x] Deve adicionar diferentes safras corretamente.
- [x] Deve criar uma fazenda com sucesso mesmo sem safras.
- [x] Deve lançar exceção ao tentar adicionar uma safra inválida (null).
- [x] Deve lançar exceção se o nome da fazenda for vazio.
- [x] Deve lançar exceção se a cidade da fazenda for vazia.
- [x] Deve lançar exceção se o estado da fazenda for vazio.
- [x] Deve lançar exceção se a área total for menor que a soma da área agrícola e da área de vegetação.

**Harvest (Safra)**

- [x] Deve criar uma safra com sucesso usando dados válidos.
- [x] Deve lançar exceção se a descrição da safra for vazia.
- [x] Deve lançar exceção se o ano da safra não for informado.
- [x] Deve lançar exceção se a cultura associada à safra não for informada (undefined).

**Crop (Cultura)**

- [x] Deve criar uma cultura com sucesso quando o nome for válido.
- [x] Deve lançar exceção se o nome da cultura for vazio.

**CPF (Value Object)**

- [x] Deve normalizar o valor do CPF na construção do objeto.
- [x] Deve formatar o CPF se o método de formatação estiver disponível no validador.
- [x] Deve retornar o valor bruto do CPF no formato caso o método de formatação não esteja disponível.
- [x] Deve lançar a exceção InvalidDocumentException se o CPF for inválido segundo o validador.

**CNPJ (Value Object)**

- [x] Deve normalizar o valor do CNPJ na construção do objeto.
- [x] Deve formatar o CNPJ se o método de formatação estiver disponível no validador.
- [x] Deve retornar o valor bruto do CNPJ no formato caso o método de formatação não esteja disponível.
- [x] Deve lançar a exceção InvalidDocumentException se o CNPJ for inválido segundo o validador.

##### Camada de Aplicação

**ProducerApplicationService**

- [x] Deve criar um produtor apenas com nome e documento.
- [x] Deve criar um produtor com uma fazenda associada.
- [x] Deve criar um produtor com fazenda e safra associadas, incluindo a cultura da safra.
- [x] Deve lançar exceção se o nome do produtor estiver vazio.
- [x] Deve lançar exceção se o nome da cultura (crop) estiver vazio durante a criação do produtor com fazenda e safra.

---

### URL base da aplicação

Após iniciar a aplicação, a URL base estará disponível localmente em: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)

---

### Documentação com Swagger (OpenAPI)

Após iniciar a aplicação, a documentação estará disponível localmente em: [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

---

### URL para checar status da API

Após iniciar a aplicação, um endpoint foi disponibilizado para retornar o status da API localmente em: [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health)

### Arquivo de rotas (Postman)

- [Producers.postman_collection.json](https://github.com/user-attachments/files/20734898/Producers.postman_collection.json)

### Estrutura importante para configurações

- As entidades estão localizadas em: src/\*_/_.entity.ts
- As migrações estão em: database/migrations/\*.ts
- A configuração do TypeORM está em: src/database/typeorm.config.ts
- A instância do DataSource para CLI está em: src/database/data-source.ts

#### Gerando novas migrações

Utilize a sintaxe a seguir:

- Ambiente de desenvolvimento: `npm run migration:generate:dev -- database/migrations/TituloMigracao`
- Ambiente de produção: `npm run migration:generate:prod -- database/migrations/TituloMigracao`

### Observações

- As migrations e as entidades usam arquivos .ts no ambiente de desenvolvimento e arquivos compilados .js na produção.
- Nunca rode a aplicação em produção com synchronize: true para evitar perda de dados.
- Use os comandos do TypeORM CLI sempre apontando para o arquivo que exporta a instância do DataSource (data-source.ts).

Se precisar de ajuda para configurar ou rodar algum comando, só avisar!

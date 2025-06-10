# Especificação de Requisitos de Software - agro-manager

- [Objetivo](#objetivo)
- [Requisitos Funcionais](#requisitos-funcionais)
- [Requisitos Não Funcionais](#requisitos-nao-funcionais)

## Objetivo

Aplicação para gerenciar o cadastro de produtores rurais e suas propriedades, incluindo informações detalhadas sobre fazendas, safras e culturas plantadas. A solução deve possibilitar operações CRUD, validações de dados e exibição de métricas relevantes em um dashboard intuitivo.

## Requisitos funcionais

### Cadastro de produtores rurais

- Permitir o cadastro, edição e exclusão de produtores rurais, com validação de CPF ou CNPJ.
- Cada produtor pode estar associado a múltiplas propriedades rurais (fazendas).

### Gerenciamento de propriedades rurais (fazendas)

- Cadastro, edição e exclusão de fazendas vinculadas a produtores.
- Armazenar dados como nome da fazenda, cidade, estado, área total, área agricultável e área de vegetação.
- Validar que a soma das áreas agricultável e de vegetação não ultrapasse a área total da fazenda.

### Gestão de safras e culturas

Os dados relacionados a safras e culturas serão adicionados manualmente no banco de dados, a fim de concentrar esforços na funcionalidade principal, que é o cadastro de produtor rural.

### Relatórios

- Exibir o total de fazendas cadastradas
- Mostrar a soma total de hectares cadastrados

- Apresentar as seguintes informações
  - Distribuição de fazendas por estado
  - Distribuição das culturas plantadas
  - Uso do solo (área agricultável e área de vegetação)

## Requisitos não funcionais

### Desempenho e escalabilidade

- A aplicação deve ser escalável para suportar crescimento no número de produtores, fazendas e registros.

### Segurança

- Implementar boas práticas para proteção de dados sensíveis, especialmente validação e armazenamento de CPF/CNPJ

### Tecnologias a serem usadas

**Backend**

- Node.js com Nest.js (TypeScript).
- ORM: TypeORM.
- Banco de Dados: PostgreSQL.

**Documentação da API**

- Documentação em OpenAPI (Swagger).

**Testes**

- Testes unitários e integrados com Jest

## Change log

| Responsável     | Criado em  | Versão | Atualizado em |
| --------------- | ---------- | ------ | ------------- |
| Anderson Vieira | 2025-10-06 | 001    | 2025-10-06    |

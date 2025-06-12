# Projeto Agro Manager

## Documentação

### Especificação de requisitos

- [ERS 1 - Especificação de Requisitos de Software](https://github.com/vieira-a/agro-manager/blob/main/docs/requisitos/001-especificacao-requisitos.md)

### Arquitetura

- [API Design](https://github.com/vieira-a/agro-manager/blob/main/docs/arquitetura/001-api-design.md)

- [C4 Model](https://github.com/vieira-a/agro-manager/blob/main/docs/arquitetura/002-c4-model.md)

- [Bounded Contexts](https://github.com/vieira-a/agro-manager/blob/main/docs/arquitetura/003-bounded-contexts.md)

- [Database ER Diagram](https://github.com/vieira-a/agro-manager/blob/main/docs/arquitetura/004-erd-diagram.md)

### ADR - (Architecture Decision Records)

Nesta seção, estão relacionadas as decisões ao longo do desenvolvimento do projeto relacionadas à arquitetura. Decisões que documentam o contexto, alternativas avaliadas, bem como a escolha e suas consequências.

- [ADR 001 Architecture Overview](https://github.com/vieira-a/agro-manager/blob/main/docs/adr/001-architecture-overview.md)

Mostra a visão geral da arquitetura adotada com base em monólito modular, equilibrando simplicidade, qualidade e agilidade.

- [ADR 002 Persistence Architecture](https://github.com/vieira-a/agro-manager/blob/main/docs/adr/002-persistence-architecture.md)

Mostra como será aplicado o padrão Repository para abstrair acesso ao banco de dados, mantendo o domínio desacoplado da tecnologia de persistência

- [ADR 003 Definição do agregado Produtor (Substituída pela ADR-005)](https://github.com/vieira-a/agro-manager/blob/main/docs/adr/003-producer-aggregate-root-definition.md)

Mostra a definição do `Producer` como raiz de um agragado que encapsula `Farm`, `Harvest` e `Crop`, garantindo consistência dos dados desde a criação do produtor.

- [ADR 004 Validação de CPF e CNPJ](https://github.com/vieira-a/agro-manager/blob/main/docs/adr/004-cpf-cnpj-validator.md)

Mostra a definição de uma estratégia para validação de CPF ou CNPJ do `Producer` no momento da sua criação, garantindo coesão e imutabilidade.

- [ADR 005 Revisão da definição do agregado Produtor](https://github.com/vieira-a/agro-manager/blob/main/docs/adr/005-producer-aggregate-root-revised.md)

Mostra a revisão da definição do `Producer` como raiz de um agragado e seus relacionamentos com `Farm`, garantindo consistência dos dados e flexibilização na criação do produtor.

# ADR 006 — Estratégia de mapeamento entre entidades de domínio e entidades de persistência

| Responsável     | Criado em  | Versão | Atualizado em | Status |
| --------------- | ---------- | ------ | ------------- | ------ |
| Anderson Vieira | 12-06-2025 | 001    | 12-06-2025    | Aceito |

## Contexto

A aplicação utiliza entidades de domínio para representar as regras de negócio e entidades específicas para persistência, usadas pelo ORM. Para manter o domínio desacoplado da infraestrutura, é necessário definir como fazer a conversão entre esses dois modelos.

## Decisão

Adotar o uso de mappers explícitos para converter entre as entidades de domínio e as entidades de persistência.

- Implementar mappers como classes estáticas, por exemplo `FarmMapper` e `ProducerMapper`, com métodos `toDomain` e `toEntity`.
- Manter a lógica de conversão controlada manualmente para garantir validações e integridade.
- Evitar acoplamento do domínio com a lib de ORM.
- Garantir que o domínio permaneça puro, facilitando testes e evolução.

## Alternativas consideradas

- Expor diretamente entidades ORM no domínio.
  - Vantagens: menos código.
  - Desvantagens: forte acoplamento, risco de vazamento de lógica de persistência no domínio.

## Consequências

- Código mais explícito e claro sobre como os dados trafegam entre camadas.
- Facilidade para testes unitários usando mocks.

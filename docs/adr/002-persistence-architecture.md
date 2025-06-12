# ADR 002 — Arquitetura da camada de persistência e uso do padrão repository desacoplado

| Responsável     | Criado em  | Versão | Atualizado em | Status |
| --------------- | ---------- | ------ | ------------- | ------ |
| Anderson Vieira | 10-06-2025 | 001    | 10-06-2025    | Aceito |

## Contexto

O projeto consiste em uma API backend para cadastro e gerenciamento de produtores rurais, com regras de negócio e validações específicas, desenvolvida em Node.js com Nest.js e PostgreSQL. Como o projeto é um teste técnico com escopo limitado e foco em entrega ágil, há necessidade de um equilíbrio entre:

- Manter código limpo, testável e de fácil manutenção;
- Evitar complexidade excessiva e camadas desnecessárias que atrasem a entrega;
- Possibilidade futura de evolução e adaptação da arquitetura.

## Decisão

Adotarei uma abordagem **moderada**, utilizando o padrão **Repository** desacoplado **com interface**, porém mantendo a estrutura simples e enxuta, para não gerar overhead desnecessário.

Especificamente:

- Será criada uma interface `IProducerRepository` para definir os contratos de acesso aos dados.
- A implementação concreta da interface usará o ORM escolhido (TypeORM).
- A interface será injetada nos serviços via `@Inject` do Nest.js, facilitando testes unitários com mocks.
- A estrutura do projeto não será excessivamente fragmentada em pastas complexas; mantendo uma organização simples que permita evolução futura.
- O foco será na agilidade e entrega rápida, mas sem abrir mão da qualidade e testabilidade.

## Alternativas consideradas

- **Usar ORM direto nos serviços (sem interface/repositório desacoplado):**

  - Vantagem: entrega mais rápida e menos boilerplate.
  - Desvantagem: acoplamento forte, difícil testar lógica isoladamente, menor flexibilidade futura.

- **Arquitetura DDD/Clean Architecture completa (domínio, aplicação, infraestrutura separados):**
  - Vantagem: máxima separação de preocupações, flexibilidade e escalabilidade.
  - Desvantagem: complexo, muito boilerplate, pode atrasar entregas em projetos pequenos.

## Consequências

- Será gerada uma base de código limpa, com contratos claros para acesso a dados, facilitando testes e manutenção.
- Será evitada complexidade de uma arquitetura totalmente DDD, mantendo a agilidade no desenvolvimento.
- Será possível evoluir a arquitetura para um modelo mais robusto conforme o projeto amadurecer.
- Para este teste técnico, não haverá impacto significativo na velocidade de entrega.

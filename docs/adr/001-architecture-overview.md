# ADR 001 — Arquitetura geral: monólito modular como base para evolução incremental

| Responsável     | Criado em  | Versão | Atualizado em | Status |
| --------------- | ---------- | ------ | ------------- | ------ |
| Anderson Vieira | 2025-10-07 | 001    | 2025-10-07    | Aceito |

## Contexto

O projeto é um backend para gerenciamento de produtores rurais, com escopo inicial de MVP e potencial para crescimento futuro. O teste técnico precisa ser entregue rapidamente, como uma solução funcional, testável e de fácil manutenção. A ideia é não se perder em complexidades arquiteturais desde o início.

No mercado atualmente, muito se discute sobre as várias opções arquiteturais: microsserviços, Event-Driven Architecture (EDA), Domain-Driven Design (DDD), monólito modular, etc. Contudo, iniciar com arquiteturas complexas pode atrasar o projeto gerando overhead desnecessário.

## Decisão

Optei por uma arquitetura de **Monólito Modular**, que organiza a aplicação em módulos bem definidos e isolados (ex: módulo de produtores, módulo de propriedades, módulo de safra), usando os recursos nativos do Nest.js para modularização.

Características principais de um monólito modular:

- Cada módulo encapsula suas entidades, serviços, controladores e repositórios.
- A comunicação entre módulos é feita via interfaces e injeção de dependências, promovendo baixo acoplamento.
- Estrutura organizada e simples, facilitando entendimento e manutenção.
- Facilita testes isolados por módulo.
- Permite evolução gradual para microsserviços ou outras arquiteturas conforme o projeto e time cresçam.
- Mantém agilidade e simplicidade no desenvolvimento.

Para este caso específico, onde o teste possui foco em uma feature principal, apenas um módulo será desenvolvido como base para os demais módulos.

## Alternativas consideradas

- **Microsserviços desde o início:**

  - Vantagem: alta escalabilidade e independência entre partes.
  - Desvantagem: complexidade elevada, overhead de comunicação, difícil coordenação em times pequenos. Desnecessário para o projeto atual.

- **Arquitetura totalmente monolítica sem modularização:**

  - Vantagem: simplicidade extrema.
  - Desvantagem: código tende a virar “big ball of mud”, difícil manutenção e evolução.

- **Event-Driven Architecture (EDA) desde o início:**
  - Vantagem: desacoplamento e alta escalabilidade.
  - Desvantagem: complexidade operacional e necessidade de cultura madura para eventos. Desnecessário para o projeto atual.

## Consequências

- Será entregue um backend organizado, de fácil manutenção e testável, com rapidez.
- Serão reduzidos os riscos de retrabalho e complexidade inicial.
- A modularização prepara a base para futuras evoluções arquiteturais sem grandes refatorações.
- Possibilidade de expansão para microsserviços ou outras arquiteturas conforme a necessidade, com menor custo.

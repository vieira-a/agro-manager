# ADR-003: Definição do agregado `Producer`

| Responsável     | Criado em  | Versão | Atualizado em | Status |
| --------------- | ---------- | ------ | ------------- | ------ |
| Anderson Vieira | 2025-10-07 | 001    | 2025-10-12    | Substituida pela [ADR-005](https://github.com/vieira-a/agro-manager/blob/main/docs/adr/005-producer-aggregate-root-revised.md) |

## Contexto

Ao modelar o domínio da aplicação Agro Manager, identifiquei que a criação de um produtor (`Producer`) exige o fornecimento de dados completos sobre sua estrutura, que inclui:

- Fazendas (`Farm`)
- Safras (`Harvest`)
- Culturas (`Crop`)

Essas informações são parte essencial da criação de um produtor, pois determinam sua capacidade produtiva e baseiam as regras de negócio como rastreabilidade, produtividade, etc.

Além disso, prioriza a simplicidade e coesão no domínio, organizando os dados de forma aninhada e encapsulada.

## Decisão

Decidi que o `Producer` será a raiz de um agregado que poderá conter:

- Múltiplas fazendas `(Farm)`
  - Cada `Farm` possui múltiplas safras `(Harvest)`
    - Cada `Harvest` possui múltiplas culturas `(Crop)`

A criação de um novo `Producer` exigirá a criação aninhada dessas entidades dependentes, de forma que todas as validações e garantias de consistência sejam realizadas dentro do agregado.

Com isso, o agregado `Producer` será responsável por manter a consistência de todo o seu ciclo de vida, incluindo:

- Validação de dados de área (ex: total vs agrícola + vegetação) conforme requisito

## Consequências

- Será adotada uma modelagem aninhada, que irá tornar a criação do produtor mais complexa no início, porém, garantndo que os dados sejam sempre consistentes e alinhados ao domínio.
- A persistência exigirá inserções em cascata no bancos de dados.
- Todas as modificações em `Farm`, `Harvest` e `Crop` devem ser mediadas pelo `Producer`, centralizando regras de negócio e simplificando a lógica dos serviços de aplicação.

## Alternativas Consideradas

- Criar domínios próprios para `Farm`, `Harvest` e `Crop`: rejeitado para este caso, pois implicaria em um domínio excessivamente granular, visto que o requisito principal do teste técnico é a criação do Produtor `Producer`

## Revisão e Atualização

Esta ADR foi substituída parcialmente pela [ADR-005](https://github.com/vieira-a/agro-manager/blob/main/docs/adr/005-producer-aggregate-root-revised.md), trazendo maior flexibilidade para o processo de criação do produtor.


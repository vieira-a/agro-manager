# ADR-005: Flexibilização da criação do agregado `Producer` sem exigência imediata de `Farm`

| Responsável     | Criado em  | Versão | Atualizado em | Status    |
| --------------- | ---------- | ------ | ------------- | --------- |
| Anderson Vieira | 12-06-2025 | 001    | 12-06-2025   | Aceito    |

## Contexto

A ADR-003 definiu o agregado `Producer` como contendo obrigatoriamente fazendas (`Farm`), safras (`Harvest`) e culturas (`Crop`) no momento da sua criação, visando garantir a consistência e integridade dos dados desde o início.
Entretanto, com a evolução dos requisitos e análises práticas de usabilidade e modelagem, constatou-se que essa obrigatoriedade pode causar rigidez e complexidade desnecessária na criação inicial do produtor.

## Alternativas Consideradas

- Manter a obrigatoriedade da criação aninhada de `Farm` e `Harvest` no `Producer` (ADR-003): rejeitado por reduzir a flexibilidade e dificultar cenários reais de uso.
- Criar domínios ou agregados separados para `Farm` e `Harvest`: considerado, mas fora do escopo atual e da complexidade desejada para o teste técnico.
- 
## Decisão

Decidi flexibilizar a criação do agregado `Producer` para que a inclusão de uma `Farm` seja **opcional** no momento inicial.

- O `Producer` poderá ser criado sem a necessidade imediata de associar uma `Farm`.
- Fazendas (`Farm`) poderão ser adicionadas, editadas e removidas após a criação do `Producer`.
- A relação entre `Producer` e `Farm` permanece, porém a agregação inicial deixa de ser estrita.
- `Harvest` e `Crop` continuam sendo parte das propriedades da `Farm`, mantendo sua hierarquia.
- As validações de consistência, como áreas e relações, permanecem ativas nas entidades respectivas.

## Consequências

- A criação inicial do produtor fica mais simples e flexível, melhorando a experiência do usuário.
- O modelo do domínio passa a refletir melhor os cenários reais de uso, onde nem sempre se tem todas as informações no cadastro inicial.
- A complexidade de persistência e orquestração pode aumentar um pouco, pois operações em `Farm` e `Harvest` podem ocorrer de forma independente após o cadastro do `Producer`.
- Serviços e APIs precisarão adaptar-se para aceitar atualizações incrementais no agregado.
- Validações e regras de negócio precisam garantir a integridade ao longo do tempo, considerando a possibilidade de estado parcial.

## Referências

- ADR-003: Definição do agregado `Producer`

---

## Revisão e Atualização

Esta ADR substitui parcialmente a ADR-003, trazendo maior flexibilidade para o processo de criação do produtor.

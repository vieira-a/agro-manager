# ADR 004 - Validação de CPF e CNPJ via value objects desacoplados

| Responsável     | Criado em  | Versão | Atualizado em | Status |
| --------------- | ---------- | ------ | ------------- | ------ |
| Anderson Vieira | 10-06-2025 | 001    | 10-06-2025    | Aceito |

## Contexto

A aplicação precisa garantir que CPF e CNPJ estejam sempre válidos no momento da criação de um novo `Producer`, sem acoplamento direto a bibliotecas externas para facilitar manutenção e testes.

## Opções consideradas

1. Validar direto no VO usando lib externa

- Simples, mas acopla o domínio a uma lib de terceiros.
- Viola o princípio da inversão de dependência

2. Desacoplar validação via interface e injeção de dependência.

- Introduz uma interface (DocumentValidator) com contratos claros.
- As implementações concretas (como CpfValidator, CnpjValidator) ficam na camada de infraestrutura e usam bibliotecas externas.
- Uma factory (DocumentValidatorFactory) é usada para instanciar o validador correto conforme o tipo de documento.
- O domínio continua puro e isolado.

3. Realizar a validação fora do domínio (ex: em services ou controllers)

- Evita acoplamento, mas quebra a regra de que um VO deve ser criado apenas em um estado válido.
- Move responsabilidade de consistência do domínio para fora dele.

## Decisão

Adotei a segunda abordagem, desacoplando a validação via interface chamada `DocumentValidator`, a ser implementada por validadores concretos específicos de CPF e CNPJ.
Para determinar a instância correta do validador, criei uma Factory (DocumentValidatorFactory), responsável por fornecer o validador certo no momento da criação do VO (CPF ou CNPJ), de acordo com a quantidade de caracteres informados (11 para CPF ou 14 para CNPJ).

## Consequências

- Domínio desacoplado de infra.
- Testes facilitados.
- Complexidade um pouco maior na criação dos VOs.

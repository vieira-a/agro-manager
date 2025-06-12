# C4 Model

## Objetivo

Este documento apresenta os principais diagramas de arquitetura baseados no modelo C4.

### 1. Context diagram

```mermaid
C4Context
  title Context diagram for Agro Manage

  Person(user, "Usuário", "Produtor rural, parceiro ou desenvolvedor utilizando a aplicação")
  System(system, "Agro Manager", "Sistema de gerenciamento de produtores e propriedades rurais")
  System_Ext(emailService, "Serviço de E-mail", "Serviço externo de notificações e mensagens")

  Rel(user, system, "Usa")
  Rel(system, emailService, "Envia notificações")
```

### 2. Container diagram

```mermaid
C4Container
  title Container diagram for Agro Manage

  Container_Boundary(system, "Agro Manager") {
    Container(api, "API REST", "Nest.js", "Exposição de endpoints para o frontend e integração externa")
    Container(application, "Application Layer", "Node.js", "Orquestra casos de uso da aplicação")
    Container(domain, "Domain Layer", "Node.js", "Entidades de negócio, regras e lógica central")
    Container(infra, "Infrastructure Layer", "Node.js + Postgres", "Comunicação com banco de dados e serviços externos")
    Container(database, "Banco de Dados", "PostgreSQL", "Armazena dados da aplicação")
  }

  Person(user, "Usuário", "Usuário do sistema Agro Manager")

  Rel(user, api, "Realiza chamadas HTTP")
  Rel(api, application, "Orquestra casos de uso")
  Rel(application, domain, "Aplica regras de negócio")
  Rel(application, infra, "Acessa recursos externos")
  Rel(infra, database, "Lê e grava dados")
```

### 3. Component diagram

```mermaid
C4Component
title Component diagram for Application Layer (Agro Manager)

Person(user, "Usuário")

Component(service, "ProducerApplicationService", "TypeScript", "Gerencia operações de produtores")
Component(repository, "ProducerRepository", "Interface", "Abstração para persistência de produtores")
Component(dto, "DTOs", "TypeScript", "Estrutura de dados para entrada/saída")
Component(usecase, "UseCases", "TypeScript", "Casos de uso reutilizáveis")

Rel(user, service, "Interage com")
Rel(service, repository, "Persiste e consulta produtores")
Rel(service, dto, "Envia/recebe dados de entrada e saída")
Rel(service, usecase, "Executa lógica de negócio")
```

## Change log

| Responsável     | Criado em  | Versão | Atualizado em |
| --------------- | ---------- | ------ | ------------- |
| Anderson Vieira | 06-10-2025 | 001    | 06-10-2025    |

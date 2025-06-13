# API Design

## Objetivo

Apresentar os contratos de API propostos na aplicação **Agro Manager**

**URL base**

`/api/v1`

---

### Endpoints

#### GET /producers

Retorna todos os produtores cadastrados.

**Response**

```json
[
  {
    "id": "1ec941df-7a28-4c91-b17b-28071a4a0d7f",
    "name": "João Silva",
    "document": "12345678900",
    "farms": [
      {
        "id": "c0ae687c-f382-491d-a650-d1623a80ccc3",
        "name": "Fazenda São João",
        "state": "GO",
        "city": "Goiânia",
        "totalArea": 100.5,
        "agriculturalArea": 60.0,
        "vegetationArea": 40.5,
        "harvests": [
          {
            "id": "3f8c9c7f-8bcd-4e4c-a276-f11f3d9c07d1",
            "description": "Safra de Verão",
            "year": 2023,
            "crop": {
              "name": "Milho"
            }
          }
        ]
      }
    ]
  }
]
```

### GET /producers/:id

Retorna os dados completos de um produtor específico.

#### POST /producers

Cadastra um novo produtor com fazendas e culturas.

**Request**

```json
{
  "name": "João Silva",
  "document": "12345678900",
  "farms": [
    {
      "name": "Fazenda São João",
      "state": "GO",
      "city": "Goiânia",
      "totalArea": 100.5,
      "agriculturalArea": 60.0,
      "vegetationArea": 40.5,
      "harvests": [
        {
          "description": "Safra de Verão",
          "year": 2023,
          "crop": {
            "name": "Milho"
          }
        }
      ]
    }
  ]
}
```

**Response**

```json
{
  "id": "uuid-do-produtor"
}
```

#### PUT /producers/:id

Atualiza dados gerais do produtor (apenas nome para esse contexto). Não altera fazendas nem safras.

**Request**

```json
{
  "name": "João da Silva Neto",
}
```

#### DELETE /producers/:id

Remove um produtor e todos os dados associados (fazendas, culturas, safras).

#### POST /producers/:producerId/farms

Adiciona uma nova fazenda a um produtor existente.

**Request**

```json
{
  "name": "Fazenda Nova Esperança",
  "state": "MT",
  "city": "Cuiabá",
  "totalArea": 200.0,
  "agriculturalArea": 120.0,
  "vegetationArea": 80.0
}
```

#### POST /producers/:producerId/farms/:farmId/harvests

Adiciona uma nova safra com cultura a uma fazenda de um produtor.

**Request**

```json
{
  "description": "Safra de Inverno",
  "year": 2024,
  "crop": {
    "name": "Soja"
  }
}
```

#### GET /dashboard/summary

Retorna os dados agregados do sistema.

**Response**

```json
{
  "totalFarms": 10,
  "totalHectares": 1500.5,
  "byState": {
    "GO": 5,
    "MT": 3,
    "SP": 2
  },
  "byCulture": {
    "Soja": 6,
    "Milho": 4,
    "Café": 2
  },
  "landUse": {
    "agricultural": 900.0,
    "vegetation": 600.5
  }
}

```
---

## Change log

| Responsável     | Criado em  | Versão | Atualizado em |
| --------------- | ---------- | ------ | ------------- |
| Anderson Vieira | 10-06-2025 | 002    | 13-06-2025   |

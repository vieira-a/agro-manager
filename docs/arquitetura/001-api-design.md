# API Design

## Objetivo

Apresentar os contratos de API propostos na aplicação **Agro Manager**

**URL base**

`/api/v1`

### Endpoints

#### GET /producers

Retorna todos os produtores cadastrados.

**Response**

```json
[
  {
    "id": "1ec941df-7a28-4c91-b17b-28071a4a0d7f",
    "name": "João Silva",
    "document": "123.456.789-00",
    "farms": [
      {
        "id": "c0ae687c-f382-491d-a650-d1623a80ccc3",
        "name": "Fazenda São João",
        "state": "GO",
        "city": "Goiânia",
        "totalArea": 100.5,
        "agriculturalArea": 60.0,
        "vegetationArea": 40.5,
        "crops": [
          {
            "season": "Safra 2023",
            "culture": "Soja"
          }
        ]
      }
    ]
  }
]
```

#### POST /producers

Cadastra um novo produtor com fazendas e culturas.

**Request**

```json
{
  "name": "João Silva",
  "document": "123.456.789-00",
  "farms": [
    {
      "name": "Fazenda São João",
      "state": "GO",
      "city": "Goiânia",
      "totalArea": 100.5,
      "agriculturalArea": 60.0,
      "vegetationArea": 40.5,
      "crops": [
        {
          "season": "Safra 2023",
          "culture": "Soja"
        }
      ]
    }
  ]
}
```

## Change log

| Responsável     | Criado em  | Versão | Atualizado em |
| --------------- | ---------- | ------ | ------------- |
| Anderson Vieira | 10-06-2025 | 001    | 10-06-2025   |

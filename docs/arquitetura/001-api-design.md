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

#### GET /producers

Retorna os dados detalhados de um produtor específico.

**Response**

```json
{
  "id": "1ec941df-7a28-4c91-b17b-28071a4a0d7f",
  "name": "João Silva",
  "document": "123.456.789-00",
  "farms": [ ... ]
}
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

#### PUT /producers/:id

Atualiza um produtor existente (incluindo suas fazendas e culturas).

**Request**

```json
{
  "name": "João Silva Atualizado",
  "document": "987.654.321-00",
  "farms": [ ... ]
}
```

#### DELETE /producers/:id

Remove um produtor e todos os dados associados (fazendas, culturas, safras).

#### GET /dashboard/summary

Resumo geral para o dashboard.

**Response**

```json
{
  "totalFarms": 10,
  "totalHectares": 1530.75
}
```

#### GET /dashboard/farms-by-state

Retorna a quantidade de fazendas por estado (para gráfico de pizza).

**Response**

```json
[
  { "state": "GO", "count": 4 },
  { "state": "MG", "count": 2 },
  { "state": "SP", "count": 4 }
]
```

#### GET /dashboard/farms-by-crop

Retorna a quantidade de culturas plantadas por tipo (para gráfico de pizza).

**Response**

```json
[
  { "culture": "Soja", "count": 6 },
  { "culture": "Milho", "count": 3 },
  { "culture": "Café", "count": 1 }
]
```

#### GET /dashboard/land-use

Retorna o uso do solo somado: áreas agricultáveis e de vegetação.

**Response**

```json
{
  "agricultural": 950.5,
  "vegetation": 580.25
}
```

#### GET /producers/document/:document

Verifica se um produtor com o CPF/CNPJ fornecido já está cadastrado.

**Response**

```json
{
  "exists": true
}
```

## Change log

| Responsável     | Criado em  | Versão | Atualizado em |
| --------------- | ---------- | ------ | ------------- |
| Anderson Vieira | 10-06-2025 | 002    | 13-06-2025   |

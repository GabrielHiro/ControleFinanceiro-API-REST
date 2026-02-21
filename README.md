# Gerenciador de Eventos - API REST

API back-end do sistema de gerenciamento de eventos, feita com Node.js + Express + MongoDB.

Essa API serve o front-end Angular e é responsável por toda a lógica de negócio: cadastro de usuários, CRUD de eventos e controle de inscrições.

## Stack

- Node.js (ES Modules)
- Express 5
- MongoDB + Mongoose
- dotenv pra variáveis de ambiente
- cors habilitado

## Como rodar

1. Clonar o repo e instalar dependências:
```bash
git clone <url-do-repo>
cd gerenciador-eventos-api
npm install
```

2. Criar um arquivo `.env` na raiz (tem o `.env.example` de modelo):
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/GerenciadorEventos
```

3. Subir o servidor:
```bash
npm run dev
```

A API fica disponível em `http://localhost:3000`.

## Estrutura de pastas

```
├── server.js          # entrada principal, configura express e rotas
├── models/
│   ├── Usuario.js     # schema de usuários (organizador/participante)
│   ├── Evento.js      # schema de eventos
│   └── Inscricao.js   # schema de inscrições
├── routes/
│   ├── usuarios.js    # registro e login
│   ├── eventos.js     # CRUD de eventos + filtros
│   └── inscricoes.js  # inscrever, cancelar, listar
├── .env.example
└── package.json
```

## Endpoints

### Usuários
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/usuarios/registro` | Cadastra novo usuário |
| POST | `/usuarios/login` | Login (retorna dados do user) |
| GET | `/usuarios/:id` | Busca usuário por id |

### Eventos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/eventos` | Lista todos (aceita filtros: `categoria`, `busca`, `ordem`) |
| GET | `/eventos/:id` | Detalhes de um evento |
| GET | `/eventos/organizador/:organizadorId` | Eventos de um organizador |
| POST | `/eventos` | Cria evento |
| PUT | `/eventos/:id` | Edita evento (se ainda não ocorreu) |
| DELETE | `/eventos/:id` | Exclui evento (se ainda não ocorreu) |

### Inscrições
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/inscricoes` | Inscreve participante em evento |
| DELETE | `/inscricoes/:id` | Cancela inscrição |
| GET | `/inscricoes/participante/:participanteId` | Inscrições de um participante |
| GET | `/inscricoes/evento/:eventoId` | Inscritos em um evento |

## Regras de negócio

- Dois perfis: **organizador** e **participante**
- Organizador cria, edita e exclui eventos (só se ainda não ocorreram)
- Participante se inscreve respeitando limite de vagas
- Não permite inscrição duplicada no mesmo evento
- Ao excluir evento, remove inscrições junto

## Categorias aceitas
Tecnologia, Esportes, Música, Educação, Negócios, Outros

## Autor
Gabriel Hiro Furukawa

# API de CRUD com NestJS e Prisma

Este é um projeto de API de CRUD (Create, Read, Update, Delete) desenvolvido com NestJS e Prisma, com o objetivo de aplicar conceitos de desenvolvimento de software e boas práticas.

## Tecnologias

*   [NestJS](https://nestjs.com/)
*   [Prisma](https://www.prisma.io/)
*   [TypeScript](https://www.typescriptlang.org/)

## Arquitetura

A arquitetura deste projeto será baseada no padrão do NestJS, que segue o padrão modular e orientado a serviços, mencionado em RNF007.

## Diagrama de classe

![Image](https://github.com/user-attachments/assets/26f420b0-4cfb-4a8f-8229-89487eb13893)

*O arquivo `drawio` contendo o diagrama de classes se encontra na raiz do projeto.*

### Relacionamento:

1. Um usuário terá vários livros ⇒ (`1:N`)
2. Um livro será de um único usuário  ⇒ (`1:1`)

## Regras de negócio (RN)

### Usuários `(UsersService)`

| ID    | Regra                                                                                                                                                           | Motivo / Requisito Relacionado |
|-------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------|
| RN01 | **Unicidade de E-mail:** Não deve ser possível cadastrar dois usuários com o mesmo endereço de e-mail. O sistema deve verificar a existência antes de criar.      | Evitar duplicidade de contas (RF001) |
| RN02  | **Sanitização de Senha:** A senha nunca deve ser retornada nas respostas da API (seja na criação, listagem ou login). O campo `password` deve ser removido do objeto de retorno. | Segurança básica.              |
| RN03  | **Hash Obrigatório:** Antes de salvar ou atualizar uma senha, ela deve ser transformada em hash (Bcrypt). Nunca salvar texto puro.                               | RNF003 (Segurança).            |
| RN04  | **Edição Restrita:** Um usuário só pode alterar os dados (nome, email, senha) da sua própria conta.                                                              | RNF002 (Segurança via Token).  |

### Livros `(BooksService)`

| ID   | Regra                                                                                                                                                                                                                         | Motivo / Requisito Relacionado              |
|------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| RN05 | **Propriedade na Criação:** Ao criar um livro, o sistema deve vincular automaticamente o `userId` do livro ao ID do usuário autenticado (extraído do Token JWT). O usuário não pode enviar um `userId` de outra pessoa no corpo da requisição. | Integridade dos dados.                      |
| RN06 | **Filtro de Privacidade (Listagem Geral):** Na rota que lista usuários e livros (`GET /`), o sistema deve filtrar os livros onde `isPublic === true`. Livros privados (`false`) devem ser omitidos da resposta.                 | RF002 e RF005 (Privacidade).                |
| RN07 | **Filtro de Privacidade (Por ID):** Ao buscar um usuário específico (`GET /:id`), se quem está solicitando não for o dono do perfil, apenas livros com `isPublic === true` são retornados.                                        | RF003 e RF005.                              |
| RN08 | **Visualização do Dono:** Se o usuário autenticado solicitar a lista dos seus próprios livros, o sistema deve retornar todos (Públicos e Privados).                                                                            | Exceção à regra de privacidade para o dono. |
| RN09 | **Propriedade para Edição/Exclusão:** Para as rotas `PUT` e `DELETE` de livros, o sistema deve verificar:<br>1. O livro existe?<br>2. O `userId` do livro é igual ao ID do usuário logado?<br>Se não for, lançar erro de `Forbidden (403)`. | RF004 (Gestão de dados).                    |

## Requisitos

### Requisitos Funcionais - RF `(O que o sistema faz)`

| ID  | Descrição  | Prioridade |
| ---- | --------------- | ----------------- |
| RF001 | **Autenticação:** O sistema deve permitir criar conta e fazer login utilizando E-mail e Senha. | Alta |
| RF002 | **Visualização:** O Sistema deve fornecer através da _API_ uma rota visualizando todos os usuários e seus livros **públicos**| Alta |
| RF003 | **Visualização:** O Sistema deve fornecer através da _API_ uma rota visualizando um usuário específico por ID e mostrar seu nome, email e seus livros **públicos**| Alta |
| RF004 | **Gestão de dados:** O Sistema permite ao usuário criar, editar e excluir sua própria conta e seus livros | Alta |
| RF005 | **Privacidade:** O sistema deve restringir a visualização de livros privados apenas ao seu proprietário. | Alta |

----

### Requisitos não Funcionais - RNF `(Como o sistema tem que ser)`

| ID  | Descrição  | Prioridade |
| ---- | --------------- | ----------------- |
| RNF001 | **API:** O sistema deve ser uma API feita usando `NestJS` e `Prisma ORM` utilizando o banco de dados _`SQLite`_  | Alta |
| RNF002 | **Segurança (Autenticação):** A autenticação deve ser realizada via JWT `(JSON Web Token)` do tipo Bearer Token, garantindo que a API seja stateless. | Alta |
| RNF003 | **Segurança (Dados):** As senhas dos usuários não devem ser salvas em texto puro; deve-se utilizar criptografia (hash) usando o `Bcrypt` antes de persistir no banco. | Alta |
| RNF004 | **Documentação:** A API deve expor uma documentação interativa utilizando `Swagger (OpenAPI)`, detalhando todas as rotas, parâmetros de entrada `(DTOs)` e tipos de resposta. | Média |
| RNF005 | **Validação:** Todos os dados de entrada `(body / params)` devem ser validados com o uso de DTOs e a biblioteca `class-validator` para garantir a integridade antes de chegar ao banco | Alta |
| RNF006 | **Desempenho:** A rota de visualização de todos os usuários `(RF002)` deve implementar paginação (ex: 10 ou 20 registros por página) para evitar sobrecarga no retorno de dados. | Média |
| RNF007 | **Arquitetura:** O código deve seguir o padrão de `arquitetura modular` do _**NestJS**_, separando responsabilidades em `Controllers` (rotas), `Services` (regras de negócio) e `Repositories` (acesso a dados/Prisma). | Média |

## Rotas (Endpoints)

A seguir estão as rotas da API, com exemplos de como seriam chamadas:

### Autenticação
- `POST /auth/login` - Realiza o login e retorna um token JWT.

### Usuários (Users)
- `POST /users` - Cadastra um novo usuário.
- `GET /users` - Lista todos os usuários com seus livros públicos (com paginação).
- `GET /users/:id` - Busca um usuário por ID e seus livros públicos.
- `PUT /users/:id` - Atualiza os dados de um usuário (requer autenticação do próprio usuário).
- `DELETE /users/:id` - Deleta um usuário (requer autenticação do próprio usuário).

### Livros (Books)
- `POST /books` - Cadastra um novo livro (requer autenticação).
- `GET /books` - Lista todos os livros públicos.
- `GET /books/:id` - Busca um livro por ID.
- `PUT /books/:id` - Atualiza um livro (requer autenticação do dono do livro).
- `DELETE /books/:id` - Deleta um livro (requer autenticação do dono do livro).
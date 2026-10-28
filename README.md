
# Eventos Climáticos

## Sobre o projeto

O Eventos Climáticos é um sistema web desenvolvido para cadastrar, visualizar, editar e excluir eventos climáticos registrados em diferentes municípios.

O projeto foi desenvolvido como atividade acadêmica do curso Técnico em Desenvolvimento de Sistemas, com o objetivo de aplicar conhecimentos de desenvolvimento web e integração entre front-end e back-end.

A interface utiliza uma paleta de cores em tons de verde-água, com um layout organizado e responsivo.

## Funcionalidades

- Login de usuários.
- Visualização dos eventos climáticos cadastrados.
- Cadastro de novos eventos.
- Edição das informações dos eventos.
- Exclusão de eventos.
- Exibição de um resumo dos registros.
- Identificação do usuário conectado.
- Logout do sistema.
- Interface responsiva.

## Tecnologias utilizadas

### Front-end
- HTML
- CSS
- JavaScript

### Back-end
- Node.js
- Express.js
- API REST

### Banco de dados
- Banco de dados configurado no back-end do projeto.

## Telas do sistema

### Login

Tela de autenticação que permite ao usuário acessar o sistema utilizando e-mail e senha.

### Página inicial

Apresenta o cabeçalho do sistema, a identificação do usuário conectado, o botão para adicionar eventos, um resumo dos registros e uma tabela com os eventos climáticos cadastrados.

### Gerenciamento de eventos

Permite cadastrar novos eventos, editar informações existentes e excluir registros.

## Exemplos de eventos

| Município | Evento climático |
|---|---|
| Pedreira | Tempestade |
| Amparo | Queimada |
| Jaguariúna | Geada |

Os registros são exemplos utilizados para demonstrar o funcionamento do sistema.

## Integração com o back-end

O sistema utiliza requisições HTTP para realizar a comunicação entre o front-end e o back-end.

Principais rotas da API:

- `/usuario`: operações relacionadas aos usuários.
- `/evento`: operações relacionadas aos eventos climáticos.

O script.js é responsável pelo gerenciamento das requisições e pelo processamento das operações da API.

## Fotos do projeto


## Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- npm instalado.
- Visual Studio Code ou outro editor de código.

### 1. Instalar as dependências

No terminal, dentro da pasta do projeto, execute:

```bash
npm install
```

### 2. Iniciar o servidor

Caso o arquivo `server.js` seja o ponto de entrada do projeto, execute:

```bash
node server.js
```

### 3. Abrir o sistema

Abra o arquivo `index.html` utilizando uma extensão de servidor local, como o Live Server do Visual Studio Code.

Verifique se o endereço configurado no JavaScript corresponde à porta utilizada pelo back-end.

## Identidade visual

O projeto utiliza tons de verde-água e azul-petróleo, combinados com fundos claros, bordas discretas e botões de destaque.

A interface foi desenvolvida para facilitar a navegação e tornar o gerenciamento dos eventos climáticos mais organizado.

## Objetivos de aprendizagem

- Estruturação de páginas com HTML.
- Estilização de interfaces com CSS.
- Manipulação do DOM com JavaScript.
- Desenvolvimento de APIs com Node.js e Express.js.
- Integração entre front-end e back-end.
- Organização de rotas.
- Operações CRUD (Create, Read, Update e Delete).
- Desenvolvimento de interfaces responsivas.


# ETL Process Readme

## Visão geral

Este projeto implementa um processo ETL (Extração, Transformação e Carregamento) para transferir dados do banco de dados Konnect para um novo serviço chamado Register.

## Funcionalidades

- Extração de dados do banco de dados Konnect.
- Transformação dos dados extraídos para o formato exigido pelo Register.
- Carregamento dos dados transformados no Register.

## Instalação e Execução

### Requisitos:

- Node.js instalado

### Passos:

1. **Crie o arquivo .env:**

    - Copie o arquivo `.env.example` para `.env`.
    - Preencha o `.env` com suas credenciais de acesso ao Konnect e ao Register.

2. **Instale as dependências:**

    Execute o comando `npm install` para instalar as dependências do projeto.

3. **Execute o script de inicialização:**

    Execute o comando `npm run start` para iniciar o processo de ETL.


## Observações

- Este projeto foi desenvolvido para um caso de uso específico e pode necessitar de adaptações para outros cenários.
- A documentação detalhada das funções e classes pode ser encontrada nos comentários do código-fonte.

## Contribuições

Sugestões de melhorias, correções de bugs e novas funcionalidades são bem-vindas.

## Licença

Este projeto está sob a licença MIT: [MIT License](https://choosealicense.com/licenses/mit/)
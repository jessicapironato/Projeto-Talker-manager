# Talker Manager

Bem-vindo ao repositório do projeto Talker Manager! Aqui você irá construir uma aplicação de cadastro de palestrantes (talkers) com funcionalidades de criar, visualizar, pesquisar, editar e excluir informações.

## Funcionalidades

Neste projeto, você será responsável por desenvolver:

- Uma API com as operações de CRUD (Create, Read, Update e Delete) para gerenciar os palestrantes.
- Endpoints que irão ler e escrever em um arquivo utilizando o módulo fs.

## Início Rápido com Docker

Para iniciar o projeto utilizando Docker, siga as etapas abaixo:

1. Certifique-se de ter o Docker Compose instalado em sua máquina. Caso não tenha, consulte a documentação oficial para fazer a instalação.

2. No terminal, execute o seguinte comando para iniciar os containers:
   ```
   docker-compose up -d
   ```

3. Acesse o terminal do container da aplicação com o seguinte comando:
   ```
   docker exec -it talker_manager bash
   ```

4. Inicie a aplicação no container com o comando abaixo:
   ```
   npm start
   ```

   Para iniciar a aplicação com live-reload, utilize o seguinte comando:
   ```
   npm run dev
   ```

5. Em outro terminal, execute os testes da aplicação com o seguinte comando:
   ```
   docker exec -it talker_manager bash
   npm run lint # Executa a verificação do linter
   npm test # Executa todos os testes
   npm test 01 # Executa apenas o teste do requisito 01
   ```

## Contribuição

Contribuições são sempre bem-vindas! Se você tiver sugestões de melhorias, correções de bugs ou novas funcionalidades, sinta-se à vontade para contribuir seguindo as etapas abaixo:

1. Crie um fork do repositório.
2. Crie uma branch para sua feature/correção: `git checkout -b minha-feature`.
3. Faça as alterações desejadas.
4. Faça o commit das suas alterações: `git commit -m 'Minha nova feature'`.
5. Envie para o repositório remoto: `git push origin minha-feature`.
6. Abra um pull request explicando suas alterações.

## Contato

Em caso de dúvidas ou sugestões, entre em contato através dos seguintes canais:

- E-mail: jessicapmaximo@gmail.com
- GitHub: [https://github.com/jessicapironato](https://github.com/jessicapironato)
- LinkedIn: [https://www.linkedin.com/in/jessica-pironato/](https://www.linkedin.com/in/jessica-pironato/)

---

Esperamos que você aproveite o projeto Talker Manager e aprimore suas habilidades no desenvolvimento de APIs e manipulação de arquivos com Node.js!

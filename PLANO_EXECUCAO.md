# Plano De Evolucao Do Encurtador De Links

## Objetivo

Construir um encurtador de links com backend em FastAPI + SQLite e frontend em React TS. Ao acessar um link curto, o usuario passa por uma tela de loading antes de ser redirecionado para a URL original.

## Evolucao Por Commits

1. `chore(backend): setup backend project structure`
   - Estrutura inicial do backend, configuracao, Dockerfile e rota `/health`.

2. `feat(backend): add link shortener routes`
   - Schemas, repositorio SQLite e rotas principais do encurtador.

3. `feat(backend): finalize shortener backend`
   - CORS, validacoes, tratamento de erros e contador de acessos.

4. `chore(frontend): setup react typescript app`
   - Estrutura React TS com Vite, Dockerfile e variaveis de ambiente.

5. `feat(frontend): add redirect loading flow`
   - Rotas do frontend, criacao de links e tela de loading antes do redirect.

6. `feat(frontend): style interface with tailwind`
   - Estilizacao responsiva com Tailwind CSS.

7. `docs(readme): document project setup and usage`
   - README final e CI validando builds Docker.

8. `fix(app): apply final review adjustments`
   - Ajustes finais indicados durante a revisao.

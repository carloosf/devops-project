# Encurtador de Links

Aplicacao web para criar links curtos e redirecionar visitantes para o destino real depois de uma tela intermediaria de loading. O objetivo do projeto e demonstrar uma entrega simples, mas completa, com backend, frontend, Docker e CI/CD.

## Tecnologias

- Python 3.11
- FastAPI
- SQLite
- React
- TypeScript
- Vite
- Tailwind CSS
- Docker
- GitHub Actions

## Estrutura

```txt
devops-project/
  backend/      API em FastAPI e banco SQLite
  front/        Interface React TS
  .github/      Workflow de CI
```

## Como Rodar Com Docker Compose

Crie os arquivos de ambiente a partir dos exemplos:

```bash
cp backend/.env.example backend/.env
cp front/.env.example front/.env
```

Suba os containers:

```bash
docker compose up --build
```

Acesse:

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Swagger: http://localhost:8000/docs

## Como Rodar Localmente

Backend:

```bash
cd backend
cp .env.example .env
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

No Windows PowerShell, ative o ambiente com:

```powershell
.\venv\Scripts\Activate.ps1
```

Frontend:

```bash
cd front
cp .env.example .env
npm install
npm run dev
```

## Variaveis De Ambiente

Backend:

```env
APP_NAME="Encurtador de Links"
APP_ENV="development"
DATABASE_URL="sqlite:///./data/links.db"
FRONTEND_BASE_URL="http://localhost:3000"
BACKEND_CORS_ORIGINS="http://localhost:3000"
```

Frontend:

```env
VITE_API_URL="http://localhost:8000"
```

## Funcionalidades

- Criar link curto com slug automatico ou personalizado.
- Listar links cadastrados.
- Resolver link curto pela API.
- Exibir tela de loading antes do redirecionamento.
- Contabilizar acessos ao link curto.
- Validar URL e slug com respostas amigaveis.

## CI/CD

O workflow em `.github/workflows/main.yml` executa a cada push ou pull request para `main` e valida:

- build da imagem Docker do backend;
- build da imagem Docker do frontend.

## Membros

- Carlos Silva

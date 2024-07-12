# Gomoku

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Viet281101/Gomoku)

Gomoku (Five in a Row) is a classic strategy board game played by two players.
The game is typically played on a 15x15 grid, where players take turns placing black or white stones on the intersections.
The objective is to be the first to align five stones in a row horizontally, vertically, or diagonally.
The simplicity of the rules contrasts with the game's strategic depth, making it a challenging and engaging pastime.

[![alt text](gomoku_frontend/public/vite.svg)](https://vitejs.dev/) **&** [![alt text](gomoku_frontend/public/typescript.svg)](https://www.typescriptlang.org/) **&** [![alt text](gomoku_frontend/public/image.png)](https://www.djangoproject.com/)


### Install & Debug

Install project:
```bash
git clone https://github.com/Viet281101/Gomoku.git
cd Gomoku/
```

#### Backend (Django)

Install [Python](https://www.python.org/) then:

- Run virtual environment:
```bash
python3 -m venv env
source env/bin/activate
```

- Install [Django](https://www.djangoproject.com/download/) libraries:
```bash
pip install requirements.txt
cd gomoku_backend/
```

- Create & Apply migrations:
```bash
python manage.py makemigrations game
python manage.py migrate
```

- Run server django:
```bash
python manage.py runserver
```

#### Frontend (React TypeScript)

- Use `npm` to debug:
```bash
cd gomoku_frontend/
npm run dev
```

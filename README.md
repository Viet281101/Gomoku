# Gomoku

[![alt text](gomoku_frontend/public/vite.svg)](https://vitejs.dev/) **&** [![alt text](gomoku_frontend/public/typescript.svg)](https://www.typescriptlang.org/) **&** [![alt text](gomoku_frontend/public/image.png)](https://www.djangoproject.com/)

Gomoku (Five in a Row) is a classic strategy board game played by two players.
The game is typically played on a 15x15 grid, where players take turns placing black or white stones on the intersections.
The objective is to be the first to align five stones in a row horizontally, vertically, or diagonally.
The simplicity of the rules contrasts with the game's strategic depth, making it a challenging and engaging pastime.

### Install & Debug

```bash
git clone https://github.com/Viet281101/Gomoku.git
cd Gomoku/
```

#### Backend

Install [Python](https://www.python.org/) then:

- Run virtual environment:
```bash
python3 -m venv env
source env/bin/activate
```

- Install [Django](https://www.djangoproject.com/download/):
```bash
pip install requirements.txt
```

- Run server django:
```bash
cd gomoku_backend/
python manage.py migrate
python manage.py runserver
```

#### Frontend

- Use `npm` to debug:
```bash
cd gomoku_frontend/
npm run dev
```

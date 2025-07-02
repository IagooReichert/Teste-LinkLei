# Requisitos

- PHP 8.4
- Composer
- Node v22.16
- MySQL 8.0

# Executando projeto

- clonar o repositório
- copiar arquivo .env.example -> .env
- composer install
- npm install
- configurar dados de conexão do banco no arquivo .env
- criar a database no banco de dados (feed_linklei)
- php artisan key:generate
- php artisan optimize
- php artisan migrate
- php artisan serve
- npm run dev
- acesse http://localhost:8000/feed


# Snow

## Requirement

### API Server

- Python 3
  - python dependencies:
    - django
    - django-cors-headers
    - pillow
    - schema

### Website

- NodeJS >= v20.10.0
- NPM >= v10.2.3

## Deploy

Clone the repo:

```sh
git clone https://github.com/NYU-SE/Snow.git snow
```

### API Server

Before first run:

```sh
cd snow
ADDR="127.0.0.1:8000"
export SNOW_API_HOST="http://$ADDR"
export SNOW_API_WORKDIR=$PWD # or any other direcotry you wish to store runtime data
python ./manage.py migrate
```

To run the API server:

```sh
python ./manage.py runserver "$ADDR"
```

### Website

Before first run:

```sh
cd snow/frontend/website
npm install
```

To run the website

```sh
export VITE_SNOW_API_SERVER="http://127.0.0.1:8000/api" # match with SNOW_API_HOST
npm run dev -- --host 127.0.0.1
```

### Using Nix

If you have [Nix](https://nixos.org/) installed with flake support, you may use the following command to start the api server and website:
```sh
# To start the api server, SNOW_API_WORKDIR will be set to $PWD
nix run /path/to/repo#api
# To start the website, will be served on 127.0.0.1:5173
nix run /path/to/repo#website
```

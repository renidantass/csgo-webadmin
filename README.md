# Get started

This project is a simple way to control CSGO Server (in this case hosted via Docker on REMOTE_ADDR = 189.126.105.143)

This can be done using timche/docker-csgo [timche/docker-csgo](https://github.com/timche/docker-csgo).

## Install dependencies

> We need install these dependencies to run API

```console
pip install flask flask-restful flask-cors python-valve
```

## How run API

> Before run, create a .env file with *IP_ADDRESS*, *CSGO_PORT* and *PASSWORD*

```console
cd csgo_api/
touch .env
vim .env # Edit this with environment variables
python3 main.py
```

## How run front-end

> Just start index.html 😀

<br/>

# Testing

```console
python3 -m unittest discover -s tests
```

> If both tests pass, the application is OK
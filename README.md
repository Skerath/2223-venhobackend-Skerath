# Examenopdracht Web Services

- Student: MAURICE CANTAERT
- Studentennummer: 202181905
- E-mailadres: maurice.cantaert@student.hogent.be

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- [PM2](https://pm2.keymetrics.io/) (npm install pm2 -g)

- [NGINX](https://www.nginx.com/) heb ik gebruikt voor de SSL https connectie vanuit mijn ubuntu vps. niet nodig voor lokaal testen, omdat http dan niet geblokkeerd wordt door de browser.
-> `sudo apt-get install nginx`

-> `sudo rm /etc/nginx/sites-enabled/default`

-> `sudo touch /etc/nginx/sites-enabled/koaserver.conf`

-> `sudo nano /etc/nginx/sites-enabled/koaserver.conf`, gebruik deze config: https://pastebin.com/yv1fLfkG

-> genereer een ssl certificate en plaats het in /etc/nginx/ssl/ als cert.pem en key.pem

-> `sudo systemctl restart nginx.service`

-> `sudo systemctl status nginx.service`

## Opstarten

1. maak "ecosystem.config.js" aan in root folder. Dit is ter vervanging van de .env files, omdat ik met pm2 werk.
1a. het bestand moet volgende structuur hebben:
```module.exports = {
    apps: [{
        name: "naam_applicatie",
        script: "./src/index.js",
        env_development: {
            NODE_ENV: 'development',
            AUTH_JWKS_URI: 'https://<---VUL IN--->/.well-known/jwks.json',
            AUTH_AUDIENCE: 'https://<---VUL IN--->',
            AUTH_ISSUER: 'https://<---VUL IN--->',
            AUTH_USER_INFO: 'https://<---VUL IN--->/userinfo',
            DATABASE_HOSTNAME: '<---VUL IN--->',
            DATABASE_PORT: <---VUL IN--->,
            DATABASE_USERNAME: '<---VUL IN--->',
            DATABASE_NAME: '<---VUL IN--->',
            DATABASE_PASSWORD: '<---VUL IN--->',
            isDevelopment: 'true',
        },
        env_production: {
            NODE_ENV: 'production',
            AUTH_JWKS_URI: 'https://<---VUL IN--->/.well-known/jwks.json',
            AUTH_AUDIENCE: 'https://<---VUL IN--->',
            AUTH_ISSUER: 'https://<---VUL IN--->',
            AUTH_USER_INFO: 'https://<---VUL IN--->/userinfo',
            DATABASE_HOSTNAME: '<---VUL IN--->',
            DATABASE_PORT: <---VUL IN--->,
            DATABASE_USERNAME: '<---VUL IN--->',
            DATABASE_NAME: '<---VUL IN--->',
            DATABASE_PASSWORD: '<---VUL IN--->',
            isDevelopment: 'false',
        }
    }]
};
```

2. maak developent.js (of production.js) aan in config met volgende structuur:
```
module.exports = {
    port: <---VUL IN--->,
    log: {
        level: 'silly',
        disabled: false,
    },
    cors: {
        origins: ['<---VUL IN--->'],
        maxAge: 3 * 60 * 60,
    },
    database: {
        hostname: "<---VUL IN--->",
        port: "<---VUL IN--->",
        username: "<---VUL IN--->",
        name: "<---VUL IN--->",
        password: "<---VUL IN--->",
        isDevelopment: "<---VUL IN--->"
    },
};
```


2. na het installeren van PM2, kan je een van deze commando's uitvoeren om de service op te starten:

`pm2-dev start ecosystem.config.js --env development
pm2 start ecosystem.config.js --env production`

!! Bij het opstarten kan volgende error in de logs teruggevonden: "WARNING: NODE_APP_INSTANCE value of '0' did not match any instance config file names."
Dit is geen probleem, er is geen specifieke configuratie nodig.

2a. Na het opstarten kan je de status van de service bekijken aan de hand van
`pm2 ls`

2b. pm2 heeft de mogelijkheid om meerdere instanties van deze service op te starten, met automatische load balancing en herstarten bij crashen, maar in dit geval heeft dit geen nut. Enkel het heropstarten wordt gebruikt.

2c. Je kan de logs bekijken van alle actieve services met
`pm2 log` of de log van een instantie met `pm log <id>`

2d. Je kan een instantie stoppen met
`pm2 stop <id>` en verwijderen met `pm2 delete <id>`
of herstarten met `pm2 restart <id>`

## Testen

1 maak het bestand 'test.js' aan in config met volgende structuur:
```
module.exports = {
    env: 'test',
    port: 9000,
    log: {
        level: 'silly',
        disabled: true,
    },
    cors: {
        origins: ['http://localhost:3000'],
        maxAge: 3 * 60 * 60,
    },
    database: {
        hostname: "<---VUL IN--->",
        port: "<---VUL IN--->",
        username: "<---VUL IN--->",
        name: "<---VUL IN--->",
        password: "<---VUL IN--->",
        isDevelopment: "false",
    },
    auth: {
        jwksUri: 'https://<---VUL IN--->',
        audience: 'https://<---VUL IN--->',
        issuer: 'https://<---VUL IN--->/',
        userInfo: 'https://<---VUL IN--->/userinfo',
        tokenUrl: 'https://<---VUL IN--->/oauth/token',
        clientId: '<---VUL IN--->',
        clientSecret: '<---VUL IN--->',
        testUser: {
            userId: '<---VUL IN--->',
            username: '<---VUL IN--->',
            password: '<---VUL IN--->',
        },

    }
};
```

2. Voer commando `jest` uit om de testen te runnen.
3. Voer command `yarn test --coverage` uit om de coverage te zien van de testen. Er zijn unit testen voor repository en user met 100% coverage.

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
`module.exports = {
    apps: [{
        name: "naam_applicatie",
        script: "./src/index.js",
        env_development: {
            NODE_ENV: 'development',
            AUTH_JWKS_URI: 'https://<---VUL IN--->/.well-known/jwks.json',
            AUTH_AUDIENCE: 'https://<---VUL IN--->',
            AUTH_ISSUER: 'https://<---VUL IN--->',
            AUTH_USER_INFO: 'https://<---VUL IN--->/userinfo',
            DATABASE_HOSTNAME: 'localhost',
            DATABASE_PORT: 3306,
            DATABASE_USERNAME: 'dbdev',
            DATABASE_NAME: 'venho_dev',
            DATABASE_PASSWORD: 'dbdev',
            isDevelopment: 'true',
        },
        env_production: {
            NODE_ENV: 'production',
            AUTH_JWKS_URI: 'https://<---VUL IN--->/.well-known/jwks.json',
            AUTH_AUDIENCE: 'https://<---VUL IN--->',
            AUTH_ISSUER: 'https://<---VUL IN--->',
            AUTH_USER_INFO: 'https://<---VUL IN--->/userinfo',
            DATABASE_HOSTNAME: 'localhost',
            DATABASE_PORT: 3306,
            DATABASE_USERNAME: 'dbdev',
            DATABASE_NAME: 'venho_dev',
            DATABASE_PASSWORD: 'dbdev',
            isDevelopment: 'false',
        }
    }]
};`


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

1. Voer commando `jest` uit om de testen te runnen.
2. Voer command `yarn test --coverage` uit om de coverage te zien van de testen. Er zijn unit testen voor repository en user met 100% coverage.

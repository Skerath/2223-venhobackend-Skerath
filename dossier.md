# Maurice Cantaert (202181905)

- [x] Front-end Web Development
  - [GitHub repository][[(github.com/HOGENT-Web)] ](https://github.com/Web-IV/2223-frontendweb-Skerath)
  - [Online versie][(github.com/HOGENT-Web)](https://web-iv-2223-frontendweb-skerath.onrender.com/)
- [x] Web Services:
  - [GitHub repository][(github.com/HOGENT-Web)](https://github.com/Web-IV/2223-webservices-Skerath)
  - [Online versie][(github.com/HOGENT-Web)](https://51.89.23.246:9001/api/)

**Logingegevens**

Member (read)
- Gebruikersnaam/e-mailadres: member@test-hogent.be
- Wachtwoord: testAccount123$

Author (read & write)
- Gebruikersnaam/e-mailadres: author@test-hogent.be
- Wachtwoord: testAccount456$

E2E voor Cypress (read & write)
- Gebruikersnaam/e-mailadres: e2e@test-hogent.be
- Wachtwoord: testAccount789$

## Projectbeschrijving

Venho is de naam van een groep spelers op een competitief spel waar alles zelf te ontdekken is.
Elk ingredient is verborgen en moet onderzocht worden. De developers van het spel vragen om informatie zo verborgen mogelijk te houden en niet op het internet prijs te geven.
Bovendien heeft het veel moeite gekost om alle data te verkrijgen en kan het niet zomaar gratis aan concurrerende groepen beschikbaargesteld worden.
Op deze web applicatie is het niet alleen mogelijk als lid (Member) van Venho om de data te bekijken (indien ingelogd), het is ook mogelijk om 'de beste uitrustingen' van belangerijke kopspelers (Author). Diezelfde kopspelers hebben dan weer de mogelijkheid om hun keuzes te delen met alle Venho-leden.

De voornamelijkste data zijn ingredienten (Ingredients). Ingredienten zijn opgebouwd uit "resources" (zie UML) en, afhankelijk van het type object/item waar het gebruikt voor kan worden, kan het ook andere attributen (modifiers/requirements) bevatten. (IngredientPositionModifiers, ConsumableOnlyIdentifiers, ItemOnlyIdentifiers).

Deze ingredienten kunnen dan gebruikt worden op een object/item, afhankelijk van de usecase (profession). Stel nu een ingredient met usecase/profession Armouring, dit kan gebruikt worden voor een Helm (Helmet) of Borstplaat (Chestplate).

Kortom: elke ingelogde lid heeft toegang tot de lijst van Ingredients (met bijhorende data) en Items (met bijhorende Ingredient). Een kopspeler heeft de mogelijkheid om zijn/haar Items te delen met medeleden, en kan dit op elk moment verwijderen/aanpassen.

![uml](https://user-images.githubusercontent.com/93214249/209377609-afad0d0b-476b-49a1-9902-be9f438f7772.png)

## Screenshots

Lijst van Ingredients op desktop, geen filter
![ingredients_list](https://user-images.githubusercontent.com/93214249/209385384-0069e1c3-0df9-4cde-a511-c445ebd55c01.png)

Lijst van Ingredients op mobile, met filter
![ingredients_list_mogelijkheid_filteren_mobile](https://user-images.githubusercontent.com/93214249/209385414-c25e7fd8-6715-4a15-9e5d-18cff00c8582.png)

Nieuwe item submitten, met invoervalidatie
![submit_new_item](https://user-images.githubusercontent.com/93214249/209385601-9f319acd-0618-4fde-ad0d-242fe301c20f.png)

Een bestaande item - waar jij de eigenaar van bent - bewerken of verwijderen
![submit_new_item](https://user-images.githubusercontent.com/93214249/209385692-fd3a3480-caab-46d5-afb5-c3f933366881.png)


## Behaalde minimumvereisten

> Duid per vak aan welke minimumvereisten je denkt behaald te hebben

### Front-end Web Development

- **componenten**

  - [x] heeft meerdere componenten - dom & slim (naast login/register)
  - [x] definieert constanten (variabelen, functies en componenten) buiten de component
  - [x] minstens één form met validatie (naast login/register)
  - [x] login systeem (eigen of extern zoals bv. Auth0)
<br />

- **routing**
  - [x] heeft minstens 2 pagina's (naast login/register)
  - [x] routes worden afgeschermd met authenticatie en autorisatie
<br />

- **state-management**

  - [x] meerdere API calls (naast login/register)
  - [x] degelijke foutmeldingen indien API call faalt
  - [x] gebruikt useState enkel voor lokale state
  - [x] gebruikt Context, useReducer, Redux… voor globale state
<br />

- **hooks**

  - [x] kent het verschil tussen de hooks (useCallback, useEffect…)
  - [x] gebruikt de hooks op de juiste manier
<br />

- **varia**
  - [x] een aantal niet-triviale testen (unit en/of e2e en/of ui)
  - [x] minstens één extra technologie
  - [x] duidelijke en volledige README.md
  - [x] volledig en tijdig ingediend dossier


### Web Services

- **datalaag**

  - [x] voldoende complex (meer dan één tabel)
  - [x] één module beheert de connectie + connectie wordt gesloten bij sluiten server
  - [x] heeft migraties
  - [x] heeft seeds
<br />

- **repositorylaag**

  - [x] definieert één repository per entiteit (niet voor tussentabellen) - indien van toepassing
  - [x] mapt OO-rijke data naar relationele tabellen en vice versa
<br />

- **servicelaag met een zekere complexiteit**

  - [x] bevat alle domeinlogica
  - [x] bevat geen SQL-queries of databank-gerelateerde code
<br />

- **REST-laag**

  - [x] meerdere routes met invoervalidatie
  - [x] degelijke foutboodschappen
  - [x] volgt de conventies van een RESTful API
  - [x] bevat geen domeinlogica
  - [x] degelijke authorisatie/authenticatie op alle routes
<br />

- **varia**
  - [x] een aantal niet-triviale testen (min. 1 controller >=80% coverage)
  - [x] minstens één extra technologie
  - [x] duidelijke en volledige `README.md`
  - [x] maakt gebruik van de laatste ES6-features (object destructuring, spread operator...)
  - [x] volledig en tijdig ingediend dossier


## Projectstructuur

### Front-end Web Development

Componenten heb ik in de map 'commponents' gezet, in subdirectories op basis van categorie (items, filters, ingredients, ..). De API gerelateerde functies heb ik in hun eigen map gestoken. Pagina's waar extra code/styling in zitten, zijn verwerkt in pages.jsx. Deze Page components worden dan gebruikt in App.jsx met de pagina's waar geen extra code bij nodig is. De components Items, Ingredients en Filter zijn algemene containers die ItemCards, IngredientCards en FilterInput/FilterSelect gebruiken.

### Web Services

De back-end is grotendeels gestructureerd zoals het voorbeeldproject. In de rest laag worden de routes, authenticatie en validatie behandeld en geeft de request door aan de servicelaag. De servicelaag bevat domeinlogica en is de brug tussen de rest laag en de repository laag. De repository laag behandelt de daadwerkelijke acties naar en van de MySQL databank en mapt de data indien nodig. De connectie tussen de repository en de databank gaan via de datalaag, waar onder andere ook seeds/migraties gebeuren. In de core map vinden zich extra utilities terug: authentication, logging en het object ServiceError.

## Extra technologie

### Front-end Web Development
In combinatie met de normale Bootstrap gebruikte ik ook de React-Bootstrap component library. 
Voor de validatie gebruikte ik Formik (de behandeling van de form validatie zelf) en Yup (validatieschema, soortgelijk aan Joi maar eerder voor Front End validatie).
- React-Bootstrap: https://www.npmjs.com/package/react-bootstrap
- Formik: https://www.npmjs.com/package/formik
- Yup: https://www.npmjs.com/package/yup

### Web Services
Ik heb gebruik gemaakt van pm2, een production process manager met onder andere ingebouwde load balancer, restarten bij crashen, ..
Omdat PM2 niet werkt in Render, heb ik gebruik gemaakt van een vps met Ubuntu. Dit gaf me echter een probleem aan de front end: een http connectie worrdt tegenwoordig niet meer toegelaten door browsers. Hiervoor heb ik dus de reverse proxy NGINX geïnstalleerd samen met de automatische certificaat generator/renewer Certbot. Hierdoor kan men api calls sturen en requests krijgen via https.
- PM2: https://www.npmjs.com/package/pm2
- NGINX: https://www.nginx.com/
- CertBot: https://certbot.eff.org/

## Testresultaten

### Front-end Web Development

- Edit Item Form: item created, item edit failed validation, item edit succeeded: name changed, item deleted
- New Item Form: item created, item creation failed validation (unknown ingredient), item creation failed validation (ingredient + type mismatch), item deleted
- Unauthorized Item Edit: error on trying to delete other author's item, error on trying to edit other author's item
- Home Page: navigation links & login/logout button available

### Web Services

- Repository\Ingredient: (100% coverage)
  removeUnneededKeys, findIngredientModifiers, findIngredientsByName, findIngredientById, findIngredientNames, findIngredientProfessions, findIngredientsByQuery
  => testen of ze doen wat ze moeten doen, returnen de juiste data en juiste hoeveelheid data.
  
  ![tests_ingredient_repository](https://user-images.githubusercontent.com/93214249/209389145-1ca683e5-f548-4ce6-8313-9a4000aca843.png)


- Repository\User: (100% coverage)
  findByAuth0Id, create
  => testen of ze de juiste data returnen & de user wel aangemaakt wordt
  
  ![tests_user_repository](https://user-images.githubusercontent.com/93214249/209389372-70260bd0-9026-4af6-aa3e-67c46489d2ce.png)

- Rest\User: (100% coverage, service laag ook)
  GET all ingredients, ingredient names, ingredient modifiers, ingredient professions, ingredients by query
  => kijken of ze allemaal 200 terugsturen, of de returned data klopt, en of alle query parameters wel werken
  
  ![tests_rest_ingredient](https://user-images.githubusercontent.com/93214249/209390409-c3e266ae-6572-452e-bde2-368c9efb98a7.png)

- Test coverage:

  ![test_coverage](https://user-images.githubusercontent.com/93214249/209391009-2cb9074b-259e-4ba6-9862-49f3afa4e6e4.png)

## Gekende bugs

### Front-end Web Development

Ongekend

### Web Services

Ongekend

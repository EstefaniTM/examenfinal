{
  "info": {
    "_postman_id": "b2d2c3f0-aaaa-bbbb-cccc-123456789000",
    "name": "rentals API (Django + Postgres + JWT + Mongo)",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "baseUrl", "value": "http://127.0.0.1:8000" },
    { "key": "accessToken", "value": "" },
    { "key": "refreshToken", "value": "" },
    { "key": "feelLogId", "value": "" },
    { "key": "rentalEventId", "value": "" }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register (Public) - POST /api/auth/register/",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": { "raw": "{{baseUrl}}/api/auth/register/", "host": ["{{baseUrl}}"], "path": ["api", "auth", "register", ""] },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"user1\",\n  \"email\": \"user1@mail.com\",\n  \"password\": \"123456\"\n}"
            }
          }
        },
        {
            "name": "Login (JWT) - POST /api/auth/login/ (save tokens)",
            "event": [
                {
                "listen": "test",
                "script": {
                    "type": "text/javascript",
                    "exec": [
                    "let jsonData = {};",
                    "try { jsonData = pm.response.json(); } catch (e) {}",
                    "",
                    "if (jsonData.access) {",
                    "  pm.collectionVariables.set('accessToken', jsonData.access);",
                    "  pm.environment.set('accessToken', jsonData.access);",
                    "}",
                    "",
                    "if (jsonData.refresh) {",
                    "  pm.collectionVariables.set('refreshToken', jsonData.refresh);",
                    "  pm.environment.set('refreshToken', jsonData.refresh);",
                    "}",
                    "",
                    "pm.test('Token access recibido', function () {",
                    "  pm.expect(jsonData.access).to.be.a('string');",
                    "});"
                    ]
                }
                }
            ],
            "request": {
                "method": "POST",
                "header": [
                { "key": "Content-Type", "value": "application/json" }
                ],
                "url": { "raw": "{{baseUrl}}/api/auth/login/", "host": ["{{baseUrl}}"], "path": ["api", "auth", "login", ""] },
                "body": {
                "mode": "raw",
                "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"admin\"\n}"
                }
            }
        },
        {
          "name": "Refresh (JWT) - POST /api/auth/refresh/ (save access)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "let jsonData = {};",
                  "try { jsonData = pm.response.json(); } catch (e) {}",
                  "if (jsonData.access) pm.collectionVariables.set('accessToken', jsonData.access);",
                  "pm.test('Token access refrescado', function () { pm.expect(jsonData.access).to.be.a('string'); });"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": { "raw": "{{baseUrl}}/api/auth/refresh/", "host": ["{{baseUrl}}"], "path": ["api", "auth", "refresh", ""] },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"refresh\": \"{{refreshToken}}\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Postgres - Vehicles",
      "item": [
        {
          "name": "List vehicles (Admin token) - GET /api/vehicles/",
          "request": {
            "method": "GET",
            "header": [
              { "key": "Authorization", "value": "Bearer {{accessToken}}" }
            ],
            "url": { "raw": "{{baseUrl}}/api/vehicles/", "host": ["{{baseUrl}}"], "path": ["api", "vehicles", ""] }
          }
        },
        {
          "name": "Create vehicle (Admin) - POST /api/vehicles/",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{accessToken}}" }
            ],
            "url": { "raw": "{{baseUrl}}/api/vehicles/", "host": ["{{baseUrl}}"], "path": ["api", "vehicles", ""] },
            "body": { "mode": "raw", "raw": "{\n  \"nombre\": \"Toyota\"\n}" }
          }
        }
      ]
    },
    {
      "name": "Postgres - Rentals",
      "item": [
        {
          "name": "List rentals (Public) - GET /api/rentals/",
          "request": {
            "method": "GET",
            "url": { "raw": "{{baseUrl}}/api/rentals/", "host": ["{{baseUrl}}"], "path": ["api", "rentals", ""] }
          }
        },
        {
          "name": "Create rental (Admin) - POST /api/rentals/",
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{accessToken}}" }
            ],
            "url": { "raw": "{{baseUrl}}/api/rentals/", "host": ["{{baseUrl}}"], "path": ["api", "rentals", ""] },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"vehicle\": 1,\n  \"modelo\": \"Corolla\",\n  \"anio\": 2020,\n  \"placa\": \"ABC-1234\",\n  \"color\": \"Rojo\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Mongo - feel_log",
      "item": [
        {
          "name": "List feel logs (Auth) - GET /api/feel-logs/",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": { "raw": "{{baseUrl}}/api/feel-logs/", "host": ["{{baseUrl}}"], "path": ["api", "feel-logs", ""] }
          }
        },
        {
          "name": "Create feel log (Auth) - POST /api/feel-logs/ (save feelLogId)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "let jsonData = {};",
                  "try { jsonData = pm.response.json(); } catch (e) {}",
                  "if (jsonData.id) pm.collectionVariables.set('feelLogId', jsonData.id);",
                  "pm.test('Se creó feel log', function () { pm.expect(jsonData.id).to.be.a('string'); });"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{accessToken}}" }
            ],
            "url": { "raw": "{{baseUrl}}/api/feel-logs/", "host": ["{{baseUrl}}"], "path": ["api", "feel-logs", ""] },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"vehicle_id\": \"<vehicle ObjectId>\",\n  \"action_string\": \"creado\",\n  \"note_string\": \"Estado inicial\",\n  \"source_string\": \"sistema\"\n}"
            }
          }
        },
        {
          "name": "Get feel log by id (Auth) - GET /api/feel-logs/:id",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": {
              "raw": "{{baseUrl}}/api/feel-logs/{{feelLogId}}/",
              "host": ["{{baseUrl}}"],
              "path": ["api", "feel-logs", "{{feelLogId}}", ""]
            }
          }
        },
        {
          "name": "Patch feel log (Auth) - PATCH /api/feel-logs/:id",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{accessToken}}" }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/feel-logs/{{feelLogId}}/",
              "host": ["{{baseUrl}}"],
              "path": ["api", "feel-logs", "{{feelLogId}}", ""]
            },
            "body": { "mode": "raw", "raw": "{\n  \"note_string\": \"Actualizado\"\n}" }
          }
        },
        {
          "name": "Delete feel log (Auth) - DELETE /api/feel-logs/:id",
          "request": {
            "method": "DELETE",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": {
              "raw": "{{baseUrl}}/api/feel-logs/{{feelLogId}}/",
              "host": ["{{baseUrl}}"],
              "path": ["api", "feel-logs", "{{feelLogId}}", ""]
            }
          }
        }
      ]
    },
    {
      "name": "Mongo - rental_event",
      "item": [
        {
          "name": "List rental events (Auth) - GET /api/rental-events/",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": { "raw": "{{baseUrl}}/api/rental-events/", "host": ["{{baseUrl}}"], "path": ["api", "rental-events", ""] }
          }
        },
        {
          "name": "Create rental event (Auth) - POST /api/rental-events/ (save rentalEventId)",
          "event": [
            {
              "listen": "test",
              "script": {
                "type": "text/javascript",
                "exec": [
                  "let jsonData = {};",
                  "try { jsonData = pm.response.json(); } catch (e) {}",
                  "if (jsonData.id) pm.collectionVariables.set('rentalEventId', jsonData.id);",
                  "pm.test('Se creó rental event', function () { pm.expect(jsonData.id).to.be.a('string'); });"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{accessToken}}" }
            ],
            "url": { "raw": "{{baseUrl}}/api/rental-events/", "host": ["{{baseUrl}}"], "path": ["api", "rental-events", ""] },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"rental_id\": \"<rental ObjectId or id>\",\n  \"event_type_string\": \"creado\",\n  \"source_string\": \"web\",\n  \"note_string\": \"Inicio del evento\",\n  \"created_at\": \"2026-02-24\"\n}"
            }
          }
        },
        {
          "name": "Get rental event by id (Auth) - GET /api/rental-events/:id",
          "request": {
            "method": "GET",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": {
              "raw": "{{baseUrl}}/api/rental-events/{{rentalEventId}}/",
              "host": ["{{baseUrl}}"],
              "path": ["api", "rental-events", "{{rentalEventId}}", ""]
            }
          }
        },
        {
          "name": "Patch rental event (Auth) - PATCH /api/rental-events/:id",
          "request": {
            "method": "PATCH",
            "header": [
              { "key": "Content-Type", "value": "application/json" },
              { "key": "Authorization", "value": "Bearer {{accessToken}}" }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/rental-events/{{rentalEventId}}/",
              "host": ["{{baseUrl}}"],
              "path": ["api", "rental-events", "{{rentalEventId}}", ""]
            },
            "body": { "mode": "raw", "raw": "{\n  \"note_string\": \"Actualizado\"\n}" }
          }
        },
        {
          "name": "Delete rental event (Auth) - DELETE /api/rental-events/:id",
          "request": {
            "method": "DELETE",
            "header": [{ "key": "Authorization", "value": "Bearer {{accessToken}}" }],
            "url": {
              "raw": "{{baseUrl}}/api/rental-events/{{rentalEventId}}/",
              "host": ["{{baseUrl}}"],
              "path": ["api", "rental-events", "{{rentalEventId}}", ""]
            }
          }
        }
      ]
    }
  ]
}
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import openapi from "./openapi.json" assert { type: "json" };
import apiPlugin from "./api-plugin.json" assert { type: "json" };

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Welcome to the Ask API!";
  })
  .post("/ask", async (context) => {
    if (!context.request.hasBody) {
      context.throw(415);
    }
    const requestBody = await context.request.body().value;

    const situationArray = Object.entries(requestBody.situation).map(([key, value]) => ({ "id": key, "value": value, "order": 0 }))

    const response = await fetch("https://productmodeler.axa.com/api/v4/tenants/partners-motor-and-home/computation", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "sJikTZ90JqzqpvIsarlIc7A3EtuyohHFrTTKcoJCBO4aGTvGwHplmo2k40bw",
      },
      body: JSON.stringify({
        "productId": "141434",
        "release": "initial",
        "policy": {
          "endorsements": []
        },
        "match": [],
        "claim": {
          "lines": [
            {
              "state": [
                { "id": "now", "value": 1692184507594, "order": -1 },
                { "id": "today", "value": 1692144000000, "order": -1 },
                ...(requestBody.situation.map(([key, value]) => ({ "id": key, "value": value, "order": 0 })))
              ],
              "line_ref": "root"
            }
          ]
        },
        "ignoreTriggers": false,
        "onlyNext": false
      })
    });

    console.log("response", response);

    const { result } = await response.json();

    console.log("result", result);

    context.response.status = 200;
    context.response.body = result.nextQuestion;
  })
  .get("/openapi.json", (context) => {
    context.response.body = openapi;
  })
  .get("/.well-known/api-plugin.json", (context) => {
    context.response.body = apiPlugin;
  })

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });

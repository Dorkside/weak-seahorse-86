import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import openapi from "./openapi.json";
import apiPlugin from "./api-plugin.json";

const router = new Router();
router
  .get("/ask", (context) => {
    context.response.body = "Situation is missing information. Does the user have EXTENDED_WARRANTY?";
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

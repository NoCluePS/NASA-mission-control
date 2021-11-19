import {
  Application,
  Context,
  send,
} from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import router from './api.ts';
import { getAllPlanets } from './models/planets.ts';
import * as log from 'https://deno.land/std@0.105.0/log/mod.ts';

const app = new Application();
const PORT = 8000;

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler('INFO'),
  },
  loggers: {
    default: {
      level: 'INFO',
      handlers: ['console'],
    },
  },
});

app.addEventListener('error', (e) => {
  log.error(e.error);
});

app.use(async function (ctx: Context, next) {
  try {
    await next();
  } catch (e) {
    ctx.response.body = 'Internal server error occured';
    throw e;
  }
});

app.use(async function (ctx: Context, next) {
  await next();
  const time = ctx.response.headers.get('X-Response-Time');
  log.info(`${ctx.request.method} ${ctx.request.url}: ${time}`);
});

app.use(async (ctx: Context, next) => {
  const start = Date.now();
  await next();
  const delta = Date.now() - start;
  ctx.response.headers.set('X-Response-Time', `${delta}ms`);
});

app.use(router.allowedMethods());
app.use(router.routes());

app.use(async (ctx: Context) => {
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = [
    '/index.html',
    '/javascripts/script.js',
    '/stylesheets/style.css',
    '/images/favicon.png',
  ];
  if (fileWhitelist.includes(filePath)) {
    await send(ctx, filePath, {
      root: `${Deno.cwd()}/client`,
    });
  }
});

if (import.meta.main) {
  console.log(`Server running on http://localhost:${PORT}`);
  log.info(`${getAllPlanets().length} habitable planets found!`);
  await app.listen({
    port: PORT,
  });
}

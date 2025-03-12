import { oakCors } from 'https://deno.land/x/cors/mod.ts';
import { Application, Router } from 'https://deno.land/x/oak@v17.1.4/mod.ts';
import 'jsr:@std/dotenv/load';
import excelRouter from './features/excel/excel-generator.route.ts';
import projectsRouter from './features/project/projects.route.ts';
import { supabase } from './utils/supabase.client.ts';

const port: number = parseInt(Deno.env.get('BACKEND_PORT') ?? '2000');

const app = new Application();
// Logging
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.request.method} ${ctx.request.url} - ${ms}ms`);
});
// Auth
app.use(async (ctx, next) => {
  const token = ctx.request.headers.get('Authorization');
  if (token) {
    const { data: user, error } = await supabase.auth.getUser(
      token.split(' ')[1]
    );
    if (!error && user) {
      ctx.state.user = user.user;
      ctx.state.userId = user.user.id;
    }
  }
  await next();
});

const router = new Router();
router.get('/', ctx => {
  ctx.response.body = 'Hello World!';
});

app.use(
  oakCors({
    origin: '*',
  })
);

router.use('/projects', projectsRouter.routes());
router.use('/excel', excelRouter.routes());

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server running on port ${port}`);
await app.listen({ port });

import { Router } from 'https://deno.land/x/oak@v17.1.4/router.ts';
import {
  createProject,
  getMyProjects,
  getProject,
} from './projects.service.ts';

const projectsRouter = new Router();

projectsRouter.post('/', async ctx => {
  const { title, description } = await ctx.request.body.json();
  const project = await createProject(ctx.state.userId, title, description);

  if (project.error) {
    ctx.response.status = 401;
    ctx.response.body = { error: project.error, success: false };
    return;
  }

  ctx.response.body = { success: true, project };
});

projectsRouter.get('/my-projects', async ctx => {
  console.log(ctx.state.userId);
  const projects = await getMyProjects(ctx.state.userId);
  ctx.response.body = { success: true, projects };
});

projectsRouter.get('/:projectId', async ctx => {
  const projectId = ctx.params.projectId;
  if (!projectId) {
    ctx.response.status = 400;
    ctx.response.body = { error: 'Missing project ID', success: false };
    return;
  }
  ctx.response.body = await getProject(projectId);
});

export default projectsRouter;

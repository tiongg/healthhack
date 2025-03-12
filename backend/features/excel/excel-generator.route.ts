import * as XLSX from 'https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs';
import { Router } from 'https://deno.land/x/oak@v17.1.4/router.ts';
import { supabase } from '../../utils/supabase.client.ts';
import { updateWorkbook } from './excel-generator.service.ts';
import { promptGpt } from './prompter.ts';

const excelRouter = new Router();

/**
 * Gets the key value pairs form the prompt, given the visit type
 */
excelRouter.post('/validate', async ctx => {
  const { prompt, visit } = await ctx.request.body.json();
  const promptResponse = await promptGpt(visit, prompt);
  ctx.response.body = promptResponse;
});

excelRouter.post('/generate', async ctx => {
  const userId = ctx.state.userId;
  if (!userId) {
    ctx.response.status = 401;
    ctx.response.body = { error: 'Unauthorized', success: false };
    return;
  }

  const { visit, patientId, wsData, projectId } = await ctx.request.body.json();
  const sheetName = `${projectId}.xlsx`;
  const sheet = await supabase.storage.from('sheets').download(sheetName);

  if (sheet.error) {
    ctx.response.status = 401;
    ctx.response.body = { error: sheet.error, success: false };
    return;
  }

  const workbook = XLSX.read(await sheet.data.arrayBuffer());
  updateWorkbook(workbook, visit, patientId, wsData);

  const fileData = XLSX.writeXLSX(workbook, {
    type: 'buffer',
    bookType: 'xlsx',
  });

  const upload = await supabase.storage
    .from('sheets')
    .upload(sheetName, fileData, {
      upsert: true,
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

  if (upload.error) {
    ctx.response.status = 401;
    ctx.response.body = { error: upload.error, success: false };
    return;
  }

  const lastUpdated = new Date().toISOString();
  await supabase
    .from('projects')
    .update({ last_updated: lastUpdated, user_last_updated: userId })
    .eq('id', projectId)
    .select();

  const downloadUrl =
    supabase.storage.from('sheets').getPublicUrl(sheetName).data.publicUrl +
    `?t=${lastUpdated}`;

  ctx.response.body = { success: true, downloadUrl };
});

export default excelRouter;

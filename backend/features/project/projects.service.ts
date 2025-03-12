import { supabase } from '../../utils/supabase.client.ts';

export async function createProject(
  userId: string,
  projectName: string,
  projectDescription: string
) {
  const { data } = await supabase
    .from('projects')
    .insert({
      user_last_updated: userId,
      created_by: userId,
      project_name: projectName,
      project_description: projectDescription,
    })
    .select('*')
    .single();

  await supabase.storage
    .from('sheets')
    .copy('healthhack-template.xlsx', `${data.id}.xlsx`);

  return data;
}

export async function getProject(projectId: string) {
  const { data } = await supabase
    .from('projects')
    .select()
    .eq('id', projectId)
    .select(
      `
      id, project_name, project_description, created_at, last_updated
      `
    )
    .single();

  if (!data) {
    return null;
  }

  const downloadUrl =
    supabase.storage.from('sheets').getPublicUrl(`${projectId}.xlsx`).data
      .publicUrl + `?t=${data.last_updated}`;

  return {
    ...data,
    downloadUrl,
  };
}

export async function getMyProjects(userId: string) {
  const { data } = await supabase
    .from('projects')
    .select()
    .eq('created_by', userId)
    .order('last_updated', { ascending: false });

  return data ?? [];
}

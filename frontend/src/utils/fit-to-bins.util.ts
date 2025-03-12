// deno-lint-ignore-file no-explicit-any
import dayjs from 'dayjs';

export default function groupProjectsIntoTimeBins(
  projects: any[]
): Record<string, any[]> {
  return projects.reduce(
    (acc, project) => {
      const lastUpdated = project.lastUpdated;
      const date = lastUpdated.format('DD MMM YYYY');
      const today = dayjs().format('DD MMM YYYY');
      const yesterday = dayjs().subtract(1, 'day').format('DD MMM YYYY');
      const thisWeek = dayjs().startOf('week').format('DD MMM YYYY');
      const thisMonth = dayjs().startOf('month').format('DD MMM YYYY');

      if (date === today) {
        acc['Today'].push(project);
      } else if (date === yesterday) {
        acc['Yesterday'].push(project);
      } else if (lastUpdated.isAfter(thisWeek)) {
        acc['This week'].push(project);
      } else if (lastUpdated.isAfter(thisMonth)) {
        acc['This month'].push(project);
      } else {
        acc['Older'].push(project);
      }

      return acc;
    },
    {
      'Today': [],
      'Yesterday': [],
      'This week': [],
      'This month': [],
      'Older': [],
    }
  );
}

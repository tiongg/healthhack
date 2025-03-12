export const VISITS = [
  ['first', 'First Visit'],
  ['operation', 'Operation'],
  ['2weeks', '2 Weeks'],
  ['6weeks', '6 Weeks'],
  ['3months', '3 Months'],
  ['6months', '6 Months'],
] as const;

export type VisitType = (typeof VISITS)[number][0];
export const VISIT_OPTIONS = VISITS.map(([value, label]) => ({
  value,
  label,
}));

export function getVisitLabel(visit: VisitType) {
  return VISIT_OPTIONS.find(option => option.value === visit)?.label;
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function yearMonthOf(date: string): string {
  return date.slice(0, 7);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
}

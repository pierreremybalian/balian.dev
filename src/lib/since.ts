// "Freelancing again for ..." counter on the About page. Shared by the build-time render and the browser tick.
export const SINCE = "2026-09-30T15:15:00Z"; // Wednesday 30 September 2026, 10:15 Central

export function sinceText(now: Date, start = new Date(SINCE)): string {
  // whole calendar months first, then the remainder in weeks, days, hours, minutes, seconds
  let months = (now.getUTCFullYear() - start.getUTCFullYear()) * 12 + now.getUTCMonth() - start.getUTCMonth();
  const probe = new Date(start);
  probe.setUTCMonth(start.getUTCMonth() + months);
  if (probe > now) { months--; probe.setUTCMonth(start.getUTCMonth() + months); }
  let s = Math.max(0, Math.floor((now.getTime() - probe.getTime()) / 1000));
  const weeks = Math.floor(s / 604800); s -= weeks * 604800;
  const days = Math.floor(s / 86400); s -= days * 86400;
  const hours = Math.floor(s / 3600); s -= hours * 3600;
  const minutes = Math.floor(s / 60); s -= minutes * 60;
  const years = Math.floor(months / 12);
  months -= years * 12;
  const unit = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const parts: string[] = [];
  if (years) parts.push(unit(years, "year"));
  if (months) parts.push(unit(months, "month"));
  if (weeks) parts.push(unit(weeks, "week"));
  if (days) parts.push(unit(days, "day"));
  if (hours) parts.push(unit(hours, "hour"));
  if (minutes) parts.push(unit(minutes, "minute"));
  parts.push(unit(s, "second"));
  return parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}` : parts[0];
}

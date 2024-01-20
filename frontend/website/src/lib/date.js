export function formatDate(date) {
  let dt = new Date(date);

  let y = dt.getFullYear();
  let m = (dt.getMonth() + 1).toString().padStart(2, '0');
  let d = dt.getDate().toString().padStart(2, '0');

  let h = dt.getHours().toString().padStart(2, '0');
  let mi = dt.getMinutes().toString().padStart(2, '0');
  let s = dt.getSeconds().toString().padStart(2, '0');

  return `${y}-${m}-${d} ${h}:${mi}:${s}`;
}

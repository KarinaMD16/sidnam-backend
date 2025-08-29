export function formatFecha(date: Date): string {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes empieza en 0
    const y = date.getFullYear().toString().slice(-2); // últimos 2 dígitos del año
    return `${d}-${m}-${y}`;
}



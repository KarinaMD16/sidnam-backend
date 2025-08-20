export function normalize(str: string): string {
  return str
    .normalize("NFD")                 // separa letras y tildes
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .trim()                           // quita espacios inicio/fin
    .replace(/\s+/g, " ")             // convierte múltiples espacios en uno
    .toLowerCase();                   // convierte todo a minúsculas
}

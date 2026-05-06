import { Decimal } from "@prisma/client/runtime/library";

/**
 * Serialise récursivement un objet Prisma pour qu'il soit compatible avec les Client Components de Next.js.
 * Contrairement à JSON.stringify, cette version préserve les objets Date tout en convertissant
 * les objets Decimal en nombres.
 */
export function serializePrisma<T>(data: T): T {
  if (data === null || data === undefined) return data;

  // Si c'est un tableau, on sérialise chaque élément
  if (Array.isArray(data)) {
    return data.map(item => serializePrisma(item)) as any;
  }

  // Si c'est un objet Decimal de Prisma (détection robuste même avec minification)
  const isDecimal = 
    data instanceof Decimal || 
    (data as any)?._isDecimal || 
    (data as any)?.constructor?.name === "Decimal" ||
    (data && typeof data === "object" && "s" in data && "e" in data && "d" in data);

  if (isDecimal) {
    return Number(data.toString()) as any;
  }

  // Si c'est un objet Date, on le laisse tel quel (Next.js sait les sérialiser)
  if (data instanceof Date) {
    return data as any;
  }

  // Si c'est un objet, on parcourt ses propriétés récursivement
  if (typeof data === "object") {
    const serialized: any = {};
    Object.keys(data as any).forEach(key => {
      serialized[key] = serializePrisma((data as any)[key]);
    });
    return serialized as T;
  }

  return data;
}

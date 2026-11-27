import { isAfter, parseISODate } from "@/lib/date";

/** The dates and guest count a visitor searched for, carried between pages in the URL. */
export interface Stay {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

type Params = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Reads `checkIn`, `checkOut` and `guests` from search params, dropping anything invalid. */
export function parseStay(sp: Params): Stay {
  const stay: Stay = {};
  const inDate = parseISODate(one(sp.checkIn) ?? "");
  const outDate = parseISODate(one(sp.checkOut) ?? "");
  if (inDate) stay.checkIn = one(sp.checkIn);
  if (inDate && outDate && isAfter(outDate, inDate)) stay.checkOut = one(sp.checkOut);
  const guests = Math.floor(Number(one(sp.guests)));
  if (guests >= 1 && guests <= 20) stay.guests = guests;
  return stay;
}

/** `?checkIn=…&checkOut=…&guests=…`, or an empty string when nothing was searched. */
export function stayQuery(stay: Stay): string {
  const params = new URLSearchParams();
  if (stay.checkIn) params.set("checkIn", stay.checkIn);
  if (stay.checkOut) params.set("checkOut", stay.checkOut);
  if (stay.guests) params.set("guests", String(stay.guests));
  const q = params.toString();
  return q ? `?${q}` : "";
}

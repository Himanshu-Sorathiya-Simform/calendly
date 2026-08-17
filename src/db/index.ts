import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

neonConfig.fetchFunction = (url: URL | RequestInfo, options: RequestInit) => {
	return fetch(url, { ...options, cache: "no-store" });
};

const sql = neon(process.env["DATABASE_URL"]!);
export const db = drizzle(sql, { schema });

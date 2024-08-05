/**
 * @see https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help
 */
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/prisma/generated/client";

const globals = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const isLowerEnvironment = process.env.NODE_ENV !== "production";

const instance = () => {
  if (isLowerEnvironment) {
    const client = new PrismaClient({
      adapter,
      log: [{ emit: "event", level: "query" }],
    });

    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
    const formatter = require("pg-promise")();
    client.$on("query", (e) => {
      const query = formatter.as.format(e.query, JSON.parse(e.params));
      const time = new Date().toLocaleTimeString("ja-JP", { hour12: false });
      const duration = e.duration.toFixed(2);
      const colors = {
        reset: "\x1b[0m",
        cyan: "\x1b[36m",
        yellow: "\x1b[33m",
        green: "\x1b[32m",
        red: "\x1b[31m",
        dim: "\x1b[2m",
        bold: "\x1b[1m",
      };
      const performance =
        e.duration < 10
          ? colors.green
          : e.duration < 100
            ? colors.yellow
            : colors.red;
      const formatted = query
        .replace(/"public"\./g, "")
        /** SELECT */
        .replace(/SELECT /gi, "SELECT\n  ")
        .replace(/ FROM /gi, "\nFROM ")
        /** INSERT */
        .replace(/INSERT INTO /gi, "INSERT INTO\n  ")
        .replace(/ VALUES /gi, "\nVALUES ")
        .replace(/ ON CONFLICT /gi, "\nON CONFLICT ")
        .replace(/ DO UPDATE SET /gi, "\nDO UPDATE SET\n  ")
        .replace(/ DO NOTHING/gi, "\nDO NOTHING")
        .replace(/ RETURNING /gi, "\nRETURNING\n  ")
        /** UPDATE */
        .replace(/UPDATE /gi, "UPDATE\n  ")
        .replace(/ SET /gi, "\nSET\n  ")
        /** DELETE */
        .replace(/DELETE FROM /gi, "DELETE FROM\n  ")
        /** 共通 */
        .replace(/ WHERE /gi, "\nWHERE ")
        .replace(/ AND /gi, "\n  AND ")
        .replace(/ OR /gi, "\n  OR ")
        .replace(/ ORDER BY /gi, "\nORDER BY ")
        .replace(/ GROUP BY /gi, "\nGROUP BY ")
        .replace(/ HAVING /gi, "\nHAVING ")
        .replace(/ LIMIT /gi, "\nLIMIT ")
        .replace(/ OFFSET /gi, "\nOFFSET ")
        .replace(/ JOIN /gi, "\nJOIN ")
        .replace(/ LEFT JOIN /gi, "\nLEFT JOIN ")
        .replace(/ RIGHT JOIN /gi, "\nRIGHT JOIN ")
        .replace(/ INNER JOIN /gi, "\nINNER JOIN ")
        .replace(/, /g, ",\n  ");

      console.log(
        `${colors.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`,
      );
      console.log(
        `${colors.cyan}${colors.bold}[Prisma]${colors.reset} ${colors.dim}${time}${colors.reset} | ${performance}${duration}ms${colors.reset}`,
      );
      console.log(formatted);
      console.log(
        `${colors.dim}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`,
      );
    });

    return client;
  }

  return new PrismaClient({ adapter });
};

const prisma = globals.prisma ?? instance();

if (isLowerEnvironment) {
  globals.prisma = prisma;
}

export const db = prisma;

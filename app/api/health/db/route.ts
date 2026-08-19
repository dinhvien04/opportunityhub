import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sql as drizzleSql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { db } = getDb();

    const tablesResult = await db.execute<{
      table_name: string;
      table_type: string;
    }>(
      drizzleSql`
        SELECT table_name, table_type 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `
    );

    const columnsResult = await db.execute<{
      table_name: string;
      column_name: string;
      data_type: string;
      is_nullable: string;
      column_default: string;
    }>(
      drizzleSql`
        SELECT table_name, column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position;
      `
    );

    return NextResponse.json({
      tables: tablesResult.rows,
      columns: columnsResult.rows,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

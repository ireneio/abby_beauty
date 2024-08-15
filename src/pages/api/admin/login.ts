// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/lib/kysely";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcrypt'
import ErrorCode from "@/lib/api/errorCodes";
import { ApiResponse } from "@/lib/api/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  const { username, password } = req.body
  const rows = await db.selectFrom('admin')
    .where('admin.username', '=', username)
    .select(['admin.username', 'admin.password'])
    .execute()

  if (rows.length > 0) {
    const user = rows[0]
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (isPasswordMatch) {
      return res.status(200).json({
        code: ErrorCode.SUCCESS,
        data: rows.map((v) => ({ username: v.username })),
      });
    }
  }
  return res.status(200).json({
    code: ErrorCode.INVALID_ADMIN,
  });
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from "@/lib/kysely";
import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCode from "@/lib/api/errorCodes";
import { ApiResponse } from "@/lib/api/types";
import ClassesController from "@/lib/kysely/controllers/classes";

const controller = new ClassesController()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  try {
    const id = Number(req.query.id)
    if (req.method === 'GET') {
      const rows = await controller.getById(id)
  
      return res.status(200).json({
          code: ErrorCode.SUCCESS,
          data: rows,
        });
    }
  } catch (e) {
    return res.status(200).json({
      code: ErrorCode.SUCCESS,
      message: String(e),
    });
  }
}

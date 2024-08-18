// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCode from "@/lib/api/errorCodes";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { createRouter } from "next-connect";
import ProductsController from "@/lib/kysely/controllers/products";

const controller = new ProductsController()

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const id = Number(req.query.id)
  const data = await controller.getById({ id })
  return res.status(200).json({
    code: ErrorCode.SUCCESS,
    data,
  });
})

const handler = router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
})

export default handler

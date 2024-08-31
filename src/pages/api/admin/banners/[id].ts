// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCode from "@/lib/api/errorCodes";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { createRouter } from "next-connect";
import BannersController from "@/lib/kysely/controllers/banners";

const controller = new BannersController()

const router = createRouter<NextApiRequest, NextApiResponse>();

router.use(async (req, res, next) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(200).json({
      code: ErrorCode.NOT_AUTHENTICATED,
    })
  }
  const userId = session.user?.id;
  if (!userId) {
    return res.status(200).json({
      code: ErrorCode.NOT_AUTHENTICATED,
    })
  }
  req.query.userId = userId
  await next()
}).get(async (req, res) => {
  const id = Number(req.query.id)
  const data = await controller.getById({ id })
  return res.status(200).json({
    code: ErrorCode.SUCCESS,
    data,
  });
}).post(async (req, res) => {
  const id = Number(req.query.id)  
  await controller.update({ id, ...req.body })
  return res.status(200).json({
    code: ErrorCode.SUCCESS,
  });
}).delete(async (req, res) => {
  const id = Number(req.query.id)  
  await controller.remove({ id })
  return res.status(200).json({
    code: ErrorCode.SUCCESS,
  });
})

const handler = router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
})

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb', // Set the desired size limit, e.g., '2mb', '10mb', etc.
    },
  },
};

export default handler

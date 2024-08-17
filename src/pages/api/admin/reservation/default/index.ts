// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCode from "@/lib/api/errorCodes";
import ReservationDefaultController from "@/lib/kysely/controllers/reservationDefault";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { createRouter } from "next-connect";

const controller = new ReservationDefaultController()

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
  const userId = Number(req.query.userId)
  const data = await controller.getByOwnerId(userId)
  return res.status(200).json({
    code: ErrorCode.SUCCESS,
    data,
  });
}).post(async (req, res) => {
  const userId = Number(req.query.userId)
  await controller.update({ ...req.body, owner_id: userId })
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

export default handler

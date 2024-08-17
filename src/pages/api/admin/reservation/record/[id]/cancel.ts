// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCode from "@/lib/api/errorCodes";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { createRouter } from "next-connect";
import ReservationController from "@/lib/kysely/controllers/reservation";

const controller = new ReservationController()

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
    const data = await controller.cancel(id)
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

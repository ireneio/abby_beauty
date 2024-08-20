// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCode from "@/lib/api/errorCodes";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { createRouter } from "next-connect";
import PagesController from "@/lib/kysely/controllers/pages";

const controller = new PagesController()

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const slug = String(req.query.slug)
  const data = await controller.getBySlug({ slug })
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb', // Set the desired size limit, e.g., '2mb', '10mb', etc.
    },
  },
};

export default handler

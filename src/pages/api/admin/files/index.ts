// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ErrorCode from "@/lib/api/errorCodes";
import { ApiResponse } from "@/lib/api/types";
import FilesController from "@/lib/kysely/controllers/files";
import multer from 'multer';
import { createRouter } from 'next-connect';
import dayjs from 'dayjs'

const controller = new FilesController()

// Configure Multer storage
const storage = multer.memoryStorage(); // Use memoryStorage if you want to handle file in memory

const upload = multer({ storage: storage });

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .use(async (req: any, res: any, next) => {
        upload.single('file')(req, res, (err) => {
            if (err) {
                return res.status(200).json({
                    code: ErrorCode.FILE_UPLOAD,
                    message: 'file upload error'
                });
            }
            next();
        });
    })
    .post(async (req: any, res) => {
        const file = req.file
        if (file) {
            const fileBuffer = file.buffer
            const { url } = await controller.upload(fileBuffer, 'classes', file.originalname)
            return res.status(200).json({
                code: ErrorCode.SUCCESS,
                data: { url }
            });
        }
    })

const handler = router.handler({
    onError: (err: any, req, res) => {
      console.error(err.stack);
      res.status(err.statusCode || 500).end(err.message);
    },
})

export default handler

export const config = {
    api: {
      bodyParser: false,
    },
};

import { put } from "@vercel/blob";

class FilesController {
    async upload(file: any, namespace: string, filename: string) {
        const { url } = await put(`${namespace}/${filename}`, file, { access: 'public' });
        return {
            url
        }
    }
}

export default FilesController

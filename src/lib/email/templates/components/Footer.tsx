import {
    Container,
    Text,
    Img,
    Link
} from "@react-email/components";

export default function Footer() {
    return (
        <Container className="p-4 bg-[#f5f1eb]">
            <div className="flex items-center justify-center gap-4 w-full">
                <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}`} className="underline text-[#484a49] text-sm flex items-center">
                    預約體驗課程
                </Link>
                <Text className="text-[#484a49] text-sm">|</Text>
                <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/classes`} className="underline text-[#484a49] text-sm flex items-center">
                    課程介紹
                </Link>
                <Text className="text-[#484a49] text-sm">|</Text>
                <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/products`} className="underline text-[#484a49] text-sm flex items-center">
                    產品介紹
                </Link>
            </div>
        </Container>
    )
}
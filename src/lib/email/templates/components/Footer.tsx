import {
    Container,
    Text,
    Img,
    Link
} from "@react-email/components";

export default function Footer() {
    return (
        <Container className="p-4 bg-[#f5f1eb]">
            <div className="flex items-center gap-4 text-[#484a49] text-sm">
                <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}`}>預約體驗課程</Link>
                <Text>|</Text>
                <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/classes`}>課程介紹</Link>
                <Text>|</Text>
                <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/products`}>產品介紹</Link>
            </div>
        </Container>
    )
}
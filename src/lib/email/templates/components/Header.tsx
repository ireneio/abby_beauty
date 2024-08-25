import {
    Container,
    Text,
    Img,
} from "@react-email/components";

export default function Header() {
    return (
        <Container className="p-4 bg-[#f5f1eb]">
            <div className="flex items-center">
                {/* Logo */}
                <Img
                    src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`} // Replace with your logo URL
                    alt="艾比美容工作室"
                    width={64}
                    height={64}
                    className="mr-3"
                />
                {/* Brand Text */}
                <Text className="text-[#484a49] text-lg font-semibold`">
                    艾比美容工作室
                </Text>
            </div>
        </Container>
    )
}
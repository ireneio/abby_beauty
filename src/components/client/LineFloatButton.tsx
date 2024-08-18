import openLineAtAccount from "@/lib/utils/openLineAtAccount";

export default function LineFloatButton() {
    return (
        <div className="fixed bottom-[64px] right-2 md:hidden">
            <div className="w-[64px] h-[64px] p-2 rounded-full" onClick={() => openLineAtAccount()}>
                <img src="/images/logo_line.png" />
            </div>
        </div>
    )
}
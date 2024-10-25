import openLineAtAccount from "@/lib/utils/openLineAtAccount";

export default function LineFloatButton() {
    return (
        <div className="z-[999] fixed bottom-[64px] right-0 p-2 shadow-md bg-primary md:hidden flex flex-col items-center gap-[2px]">
            <div className="w-[64px] h-[64px] p-2 rounded-full" onClick={() => openLineAtAccount()}>
                <img src="/images/logo_line.png" />
            </div>
            <div className="text-xs">立即預約</div>
        </div>
    )
}
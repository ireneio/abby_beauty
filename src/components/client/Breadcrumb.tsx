import clsx from "clsx"
import { useRouter } from "next/router"

type Props = {
    list: { text: string, url?: string }[]
}

export default function Breadcrumb({ list }: Props) {
    const router = useRouter()

    return (
        <div className="flex flex-wrap gap-1 text-xs">
            {list.map((item, i, arr) => {
                return (
                    <div key={i} className="flex gap-1">
                        <div
                            className={clsx(
                                i !== arr.length - 1 ?  "text-secondary"  : "text-black",
                                item.url ? 'cursor-pointer hover:text-black' : '',
                            )}
                            onClick={() => i !== arr.length - 1 && item.url ? router.push(item.url) : null}
                        >
                            {item.text}
                        </div>
                        {i !== arr.length - 1 ?
                            <div className="text-secondary">/</div> :
                            null
                        }
                    </div>
                )
            })}
        </div>
    )
}

import { Select } from "@/components/common/select"

type Props = {
    value: number
    onChange: (value: number) => any
}

export default function SelectPerPage({ value, onChange }: Props) {
    const list = [
        { label: '10 筆/頁', value: 10 },
        { label: '20 筆/頁', value: 20 },
        { label: '50 筆/頁', value: 50 },
        { label: '100 筆/頁', value: 100 },
    ]
    
    return (
        <Select value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label="選擇日期">
            {list.map((v) => {
                return (
                    <option key={v.value} value={v.value}>{v.label}</option>
                )
            })}
        </Select>
    )
}
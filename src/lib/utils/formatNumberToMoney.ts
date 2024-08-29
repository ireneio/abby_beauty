export default function formatNumberToMoney(num: number | string) {
    const _num = typeof num === 'string' ? Number(num) : num
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(_num);
}
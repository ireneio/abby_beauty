import { Alert, AlertActions, AlertTitle } from "@/components/common/alert";
import { Button } from "@/components/common/button";

// TODO
type Props = any

export default function DialogDeleteConfirm({ open, confirmLoading, onConfirm, onCancel, children = '確認刪除?' }: Props) {
  return (
    <Alert
      open={open}
      onClose={() => onCancel()}
    >
        <AlertTitle>{children}</AlertTitle>
        <AlertActions>
            <Button disabled={confirmLoading} onClick={() => onCancel()} plain>取消</Button>
            <Button loading={confirmLoading} onClick={() => onConfirm()}>確認</Button>
        </AlertActions>
    </Alert>
  )
}
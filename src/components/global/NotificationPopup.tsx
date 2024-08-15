import { Alert, AlertActions, AlertDescription, AlertTitle } from "@/components/common/alert";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { closeAlert, openAlert } from "@/lib/store/features/global/globalSlice";
import { Button } from "@/components/common/button";

export default function NotificationPopup() {
  const dispatch = useAppDispatch()
  const alertState = useAppSelector(state => state.globalSlice.alert)

  return (
    <Alert
      open={alertState.open}
      onClose={() => dispatch(closeAlert())}
    >
      <AlertTitle>{alertState.title}</AlertTitle>
      <AlertDescription>{alertState.content}</AlertDescription>
      {alertState.showConfirmButton ?
        <AlertActions>
          <Button onClick={() => dispatch(closeAlert())}>關閉</Button>
        </AlertActions> :
        null}
    </Alert>
  )
}
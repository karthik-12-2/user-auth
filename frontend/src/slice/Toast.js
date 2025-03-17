import { Snackbar } from '@mui/joy';
import { hideToast } from './ToastSlice';
import { useSelector, useDispatch } from 'react-redux';

const Toast = () => {
    const toasts = useSelector((state) => state.toast.toasts);
    const dispatch = useDispatch();

    // const visibleToasts = toasts.filter((toast) => toast.isOpen);

    return (
        <>
            {toasts.map((toast, index) => (
                <Snackbar
                    key={toast.id}
                    autoHideDuration={1000}
                    open={toast.isOpen}
                    variant="solid"
                    color={toast.color}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    onClose={() => dispatch(hideToast({ id: toast.id }))}
                    sx={{
                        backgroundColor: toast.color || "default",
                        color: "white",
                        marginTop: `${toast.index * 6}px`,
                    }}
                >
                    {toast.message}
                </Snackbar>
            ))}
        </>
    );
}

export default Toast
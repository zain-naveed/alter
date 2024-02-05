import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const toastMessage = (type: String, msg: String) => {
  if (type === "success") {
    toast.success(msg, {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      hideProgressBar: true,
      theme: "colored",
    });
  } else {
    toast.error(msg, {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      hideProgressBar: true,
      theme: "colored",
    });
  }
};
export default function Toast() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}

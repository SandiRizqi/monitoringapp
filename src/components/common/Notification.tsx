// components/common/notification.ts
import Swal from "sweetalert2";

export function Notification(type: "Success" | "Error", message: string) {
  Swal.fire({
    icon: type.toLowerCase() as "success" | "error",
    title: type,
    text: message,
    confirmButtonColor: type === "Success" ? "#4CAF50" : "#F44336",
  });
}

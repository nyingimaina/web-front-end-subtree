import toast from "react-hot-toast";
export default class HotterToast {
  public static async promise<T>(args: {
    fn: () => Promise<T>;
    messages: {
      loading: string;
      success?: string;
      error: string;
    };
  }) {
    // Manually handle the toast states
    const toastId = toast.loading(args.messages.loading);

    try {
      const result = await args.fn();
      toast.dismiss(toastId);
      if (args.messages.success) {
        toast.success(args.messages.success!, { id: toastId });
      }
      return result;
    } catch {
      // On error, update the toast to show an error message
      toast.error(args.messages.error, {
        id: toastId,
      });
    }
  }

  public static success(args: {
    message: string;
    durationMilliseconds?: number;
    id?: string;
    onClose?: () => void;
  }) {
    toast.success(args.message, {
      duration: args.durationMilliseconds,
      id: args.id,
    });
    if (args.onClose && args.durationMilliseconds) {
      setTimeout(() => {
        if (args.onClose) {
          args.onClose();
        }
      }, args.durationMilliseconds + 250);
    }
  }
}

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
    if (!message) return null;

  return (
    <div className="bg-destructive/20 items-center p-3 rounded-md
                    flex gap-x-2 text-sm text-destructive dark:bg-rose-950/60 dark:text-rose-500 mb-2">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
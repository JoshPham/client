import { CheckCircledIcon } from "@radix-ui/react-icons";

interface FormErrorProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormErrorProps) => {
    if (!message) return null;

  return (
    <div className="bg-emerald-500/15 items-center p-3 rounded-md
                    flex gap-x-2 text-sm text-emerald-500 mb-2">
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
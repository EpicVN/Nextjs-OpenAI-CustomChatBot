import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./button";

type LoadingButtonProps = {
  loading: boolean;
} & ButtonProps;

export const LoadingButton = ({
  children,
  loading,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      {...props}
      disabled={props.disabled || loading}
      className="mt-3 w-full"
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

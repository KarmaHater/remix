import classNames from "classnames";

interface TButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function Button({
  children,
  className,
  isLoading,
  ...restProps
}: TButtonProps) {
  return (
    <button
      className={classNames(
        "flex px-3 py-2 rounded-md justify-center",
        className
      )}
      {...restProps}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({
  className,
  isLoading,
  ...restProps
}: TButtonProps) {
  return (
    <Button
      {...restProps}
      isLoading={isLoading}
      className={classNames(
        "text-white bg-primary hover:bg-primary-light",
        isLoading ? "animate-pulse" : "",
        className
      )}
    />
  );
}

export function DeleteButton({
  className,
  isLoading,
  ...restProps
}: TButtonProps) {
  return (
    <Button
      {...restProps}
      isLoading={isLoading}
      className={classNames(
        "border-2 text-red-600 border-red-600 hover:bg-red-600 hover:text-white",
        isLoading ? "border-red-400 text-red-400" : "",
        className
      )}
    />
  );
}

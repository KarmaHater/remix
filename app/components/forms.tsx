import React from "react";
import classNames from "classnames";
import { Form, useSearchParams } from "@remix-run/react";
import { useNavigation } from "@remix-run/react";
import { SearchIcon } from "~/components/icons";
import { forwardRef } from "react";

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

export function ErrorMessage({ children }: { children: string }) {
  return <div className="text-red-600 text-xs">{children}</div>;
}

interface PrimaryInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

export function PrimaryInput({ className, ...props }: PrimaryInputProps) {
  return (
    <input
      type="text"
      {...props}
      className={classNames(
        "w-full outline-none border-2 border-gray-200",
        "focus:border-primary rounded-md p-2",
        className
      )}
    />
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ error, className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={classNames(
        "mb-2 w-full outline-none m-l-4",
        "border-b-transparent border-b-2 focus:border-b-primary",
        error ? "border-b-red-600" : "",
        className
      )}
      {...props}
    />
  );
})

export function SearchBar({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching = navigation.formData?.has("q");
  return (
    <Form
      className={classNames(
        "flex border-2 border-gray-300 rounded-md",
        "focus-within:border-primary",
        isSearching ? "animate-pulse" : "",
        className
      )}
    >
      <button type="submit" className="px-2 mr-1">
        <SearchIcon />
      </button>
      <input
        type="type"
        name="q"
        defaultValue={searchParams.get("q") ?? ""}
        autoComplete="off"
        placeholder={placeholder}
        className="w-full py-3 px-2 outline-none rounded-md"
      />
      {Array.from(searchParams.entries()).map(([name, value], i) =>
        name === "q" ? null : <input key={i} type="hidden" name={name} value={value} />
      )}
    </Form>
  );
}

export function IconInput({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={classNames(
      'flex items-stretch border-2 border-gray-300 rounded-md',
      "focus-within:border-primary")}
    >
      <div className="px-2 flex flex-col justify-center">{icon}</div>
      <input className="w-full py-3 px-2 outline-none rounded-md" {...props} />
    </div>
  );
}
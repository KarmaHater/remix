type THeaderProps = { children: string };

export default function Header({ children }: THeaderProps) {
  return <h1 className="header">{children}</h1>;
}

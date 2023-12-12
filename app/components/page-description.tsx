import Header from "./header";

type TPageDescriptionProps = { header: string; description: string };

export default function PageDescription({
  header,
  description,
}: TPageDescriptionProps) {
  return (
    <div>
      <Header>{header}</Header>
      <p className="page-description-message">{description}</p>
    </div>
  );
}

type PlaceholderCardProps = {
  title: string;
  description: string;
};

export function PlaceholderCard({ title, description }: PlaceholderCardProps) {
  return (
    <article className="placeholder-card">
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
}

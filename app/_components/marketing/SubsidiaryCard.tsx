import Link from "next/link";

interface SubsidiaryCardProps {
  title: string;
  description: string;
  href: string;
}

export function SubsidiaryCard({title, description, href}: SubsidiaryCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-start gap-3 rounded-2xl border border-grey-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary-100 hover:shadow-md"
    >
      <h3 className="text-lg font-semibold text-grey-900">{title}</h3>
      <p className="text-sm text-grey-600">{description}</p>
      <span className="mt-2 text-sm font-semibold text-primary-400 group-hover:underline">Learn more &rarr;</span>
    </Link>
  );
}

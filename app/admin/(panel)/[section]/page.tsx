import { notFound } from 'next/navigation';
import { Unavailable } from '@/components/ui';
import { UNAVAILABLE_SECTIONS } from '@/content/adminNav';

export function generateStaticParams() {
  return UNAVAILABLE_SECTIONS.map((section) => ({ section: section.slug }));
}

export const dynamicParams = false;

export default async function AdminUnavailablePage({ params }: { params: Promise<{ section: string }> }) {
  const { section: slug } = await params;
  const section = UNAVAILABLE_SECTIONS.find((item) => item.slug === slug);
  if (!section) notFound();
  return (
    <>
      <h1>{section.label}</h1>
      <p className="admin-lead">{section.text}</p>
      <Unavailable>{section.label} is currently unavailable.</Unavailable>
    </>
  );
}

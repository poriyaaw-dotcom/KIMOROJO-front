import StaticPageLayout from '@/components/StaticPageLayout';

export default function FaqPage() {
  return (
    <StaticPageLayout titleKey="faq">
      <div className="space-y-6">
        <div>
          <h3 className="font-serif text-xl text-gray-900 mb-2">[Question 1]</h3>
          <p>[Answer waiting on employer]</p>
        </div>
        <div>
          <h3 className="font-serif text-xl text-gray-900 mb-2">[Question 2]</h3>
          <p>[Answer waiting on employer]</p>
        </div>
      </div>
    </StaticPageLayout>
  );
}
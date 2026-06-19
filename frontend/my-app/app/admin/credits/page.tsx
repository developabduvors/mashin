'use client';

import { LeadsView } from '../_components/LeadsView';

export default function AdminCreditsPage() {
  return (
    <LeadsView
      title="Kredit arizalari"
      subtitle="Faqat kredit so'rovlari — summa, muddat va boshlang'ich to'lov bilan"
      fixedType="CREDIT_APPLICATION"
      creditMode
    />
  );
}

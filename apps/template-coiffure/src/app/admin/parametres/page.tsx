import { db } from '@marrynov/database';
import { SettingsManager } from '@/components/admin/settings-manager';

export default async function AdminParametresPage() {
  const settings = await db.salonSetting.findMany();
  const data: Record<string, string> = {};
  for (const s of settings) {
    data[s.key] = s.value;
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-text">Paramètres</h1>
      <p className="mt-1 text-sm text-text-muted">Informations générales du salon.</p>
      <div className="mt-6">
        <SettingsManager initialSettings={data} />
      </div>
    </div>
  );
}

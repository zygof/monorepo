import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { StaffHeader } from '@/components/staff/staff-header';

export const metadata: Metadata = {
  title: 'Espace Styliste',
  robots: { index: false, follow: false },
};

export default async function StaffLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/?auth=login&callbackUrl=/staff');
  }

  const role = session.user.role;
  if (role !== 'EMPLOYEE' && role !== 'ADMIN') {
    redirect('/');
  }

  const userName = `${session.user.firstName} ${session.user.lastName}`;

  return (
    <div className="min-h-dvh bg-background">
      <StaffHeader userName={userName} />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}

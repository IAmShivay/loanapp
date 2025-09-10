import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth/utils';

export default async function Home() {
  const session = await getAuthSession();

  if (session?.user) {
    // Redirect to appropriate dashboard based on role
    redirect(`/${session.user.role}`);
  } else {
    // Redirect to login page
    redirect('/login');
  }
}

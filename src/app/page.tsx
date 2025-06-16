import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to an example profile
  // In production, you might want to show a landing page or search
  redirect('/hs');
}
import { redirect } from 'next/navigation'

export default function Home() {
  // Automatically redirect anyone visiting the home page to the login page
  redirect('/login')
}
import Nav from '@/components/Nav'
import {auth} from '@/auth'

export default async function NavLayout({ children }) {
  const session = await auth()
  if (!session.user) return null
    return (
      <>
        <Nav username={session.user.nombre} rol={session.user.role}/>
        <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        {children}
        </div>
        
      </>
    );
  }
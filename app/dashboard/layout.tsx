import { AppSidebar } from "../../components/app/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-8 bg-background overflow-auto">
        {children}
      </main>
    </div>
  )
}
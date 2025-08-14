import { AppSidebar } from '@client/components/app-sidebar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@client/components/ui/breadcrumb'
import { Separator } from '@client/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@client/components/ui/sidebar'
import { useAuth } from '@client/provider/authProvider'
import { Navigate, Outlet } from 'react-router'

const ConsoleLayout = () => {
  const { token } = useAuth();

  // Check if the user is authenticated
  if (!token) {
    // If not authenticated, redirect to the login page
    const redirectTo = window.location.pathname + window.location.search;
    const params = new URLSearchParams({redirectTo});
    const to = `/auth/login?${params}`;
    return <Navigate to={to} />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 z-10 sticky top-0 items-center border-b gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default ConsoleLayout
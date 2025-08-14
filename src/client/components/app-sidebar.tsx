import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@client/components/nav-main"
import { NavProjects } from "@client/components/nav-projects"
import { NavUser } from "@client/components/nav-user"
import { TeamSwitcher } from "@client/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@client/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Tenant One",
      logo: GalleryVerticalEnd,
      plan: "React Admin",
    },
    {
      name: "Tenant Two",
      logo: AudioWaveform,
      plan: "React Admin",
    },
    {
      name: "Tenant Three",
      logo: Command,
      plan: "React Admin",
    },
  ],
  navMain: [
    {
      id: "dashboard",
      title: "Dashboard",
      url: "/console/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      id: "system",
      title: "System",
      url: "/console/system",
      icon: Settings2,
      items: [
        {
          id: "permission",
          title: "Permission",
          url: "/console/system/permission",
          
        },
        {
          id: "role",
          title: "Role",
          url: "/console/system/role",
        },
        {
          id: "user",
          title: "User",
          url: "/console/system/user",
        },
        {
          id: "option",
          title: "Option",
          url: "/console/system/option",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

import { Avatar } from '@/components/common/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/common/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/common/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/common/sidebar'
import { SidebarLayout } from '@/components/common/sidebar-layout'
import { PropsWithChildren, useEffect } from 'react'
import { signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { ArrowRightStartOnRectangleIcon, BookOpenIcon, ChevronUpIcon, CubeIcon, DocumentIcon, DocumentTextIcon, RectangleGroupIcon, TagIcon } from '@heroicons/react/16/solid'

export default function LayoutAdmin({ children }: PropsWithChildren) {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {    
    if (status === 'unauthenticated') {
      router.replace('/admin/login')
    }
  }, [status])

  const handleSignOut = () => {
    signOut()
  }
  
  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            {/* <NavbarItem href="/search" aria-label="Search">
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem href="/inbox" aria-label="Inbox">
              <InboxIcon />
            </NavbarItem> */}

            {/* <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="/profile-photo.jpg" square />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="bottom end">
                <DropdownItem onClick={() => handleSignOut()}>
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>登出</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarItem>
              <Avatar src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" />
              <SidebarLabel>美容後台管理</SidebarLabel>
            </SidebarItem>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarHeading>課程管理</SidebarHeading>
              <SidebarItem href="/admin/trials">
                <RectangleGroupIcon />
                <SidebarLabel>體驗課程管理</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/admin/classes">
                <BookOpenIcon />
                <SidebarLabel>課程列表管理</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/admin/class_types">
                <TagIcon />
                <SidebarLabel>課程系列管理</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection>
              <SidebarHeading>產品管理</SidebarHeading>
              <SidebarItem href="/admin/products">
                <CubeIcon />
                <SidebarLabel>產品列表管理</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/admin/product_types">
                <TagIcon />
                <SidebarLabel>產品系列管理</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection>
              <SidebarHeading>網站資料管理</SidebarHeading>
              <SidebarItem href="/admin/pages">
                <DocumentTextIcon />
                <SidebarLabel>自訂頁面管理</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            {/* <SidebarSection>
              <SidebarHeading>預約管理</SidebarHeading>
              <SidebarItem href="/admin/reservation/history">預約紀錄管理</SidebarItem>
              <SidebarItem href="/admin/reservation/day">單日預約管理</SidebarItem>
              <SidebarItem href="/admin/reservation/settings">預設值管理</SidebarItem>
            </SidebarSection> */}

            <SidebarSpacer />
          </SidebarBody>
          <SidebarFooter>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar src="/profile-photo.jpg" className="size-10" square alt="" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      {session?.user?.name}
                    </span>
                    {/* <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      erica@example.com
                    </span> */}
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="top start">
                <DropdownItem onClick={() => handleSignOut()}>
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>登出</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}

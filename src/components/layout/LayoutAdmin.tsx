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
import { ArrowRightStartOnRectangleIcon, Bars2Icon, Bars4Icon, BookOpenIcon, ChevronUpIcon, Cog8ToothIcon, CubeIcon, DocumentIcon, DocumentTextIcon, GlobeAltIcon, ListBulletIcon, MegaphoneIcon, NewspaperIcon, PhotoIcon, RectangleGroupIcon, Square2StackIcon, StarIcon, TagIcon, TrophyIcon, UserIcon, UserPlusIcon } from '@heroicons/react/16/solid'

export default function LayoutAdmin({ children }: PropsWithChildren) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const user = session?.user as any
  const permission = user?.permission ?? []

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
              {/* <Avatar src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" /> */}
              <SidebarLabel>美容網站後台管理</SidebarLabel>
            </SidebarItem>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem onClick={() => window.open(`${process.env.NEXT_PUBLIC_SITE_URL}`, '_blank')}>
                <GlobeAltIcon />
                <SidebarLabel>查看前台網站</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection>
              <SidebarHeading>文章管理</SidebarHeading>
              <SidebarItem href="/admin/articles/posts">
                <MegaphoneIcon />
                <SidebarLabel>文章列表管理</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/admin/articles/tags">
                <TagIcon />
                <SidebarLabel>文章分類管理</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection>
              <SidebarHeading>體驗課程管理</SidebarHeading>
              <SidebarItem href="/admin/trials">
                <RectangleGroupIcon />
                <SidebarLabel>體驗課程列表管理</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection>
              <SidebarHeading>首頁管理</SidebarHeading>
              <SidebarItem href="/admin/home/carousels">
                <PhotoIcon />
                <SidebarLabel>輪播圖片管理</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/admin/home/services">
                <ListBulletIcon />
                <SidebarLabel>服務項目管理</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/admin/home/trials">
                <Square2StackIcon />
                <SidebarLabel>體驗課程管理</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/admin/home/comments">
                <StarIcon />
                <SidebarLabel>客戶好評管理</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/admin/home/brands">
                <TrophyIcon />
                <SidebarLabel>品牌價值管理</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/admin/home/joinus">
                <UserPlusIcon />
                <SidebarLabel>加入我們管理</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection>
              <SidebarHeading>課程介紹列表管理</SidebarHeading>
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
              <SidebarItem href="/admin/navbar">
                <Bars2Icon />
                <SidebarLabel>頁首/選單管理</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/admin/footer">
                <Bars4Icon />
                <SidebarLabel>頁尾管理</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/admin/pages">
                <DocumentTextIcon />
                <SidebarLabel>自訂頁面管理</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection>
              <SidebarHeading>網站設定管理</SidebarHeading>
              <SidebarItem href="/admin/websettings">
                <Cog8ToothIcon />
                <SidebarLabel>網站資料設定管理</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            {permission.includes('root') ?
              <SidebarSection>
                <SidebarHeading>後台管理</SidebarHeading>
                <SidebarItem href="/admin/accounts">
                  <UserIcon />
                  <SidebarLabel>後台帳號管理</SidebarLabel>
                </SidebarItem>
              </SidebarSection> :
              null
            }
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
                  {/* <Avatar src="/profile-photo.jpg" className="size-10" square alt="" /> */}
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

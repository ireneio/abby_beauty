import { Text } from "@/components/common/text";
import LayoutAdmin from "@/components/layout/LayoutAdmin";
import clsx from "clsx";
import Link from "next/link";

export default function Page() {
    const menuItems = [
        {
            groupTitle: '文章管理',
            children: [
                {
                    title: '文章列表管理',
                    link: '/admin/articles/posts'
                },
                {
                    title: '文章分類管理',
                    link: '/admin/articles/tags'
                }
            ]
        },
        {
            groupTitle: '體驗課程管理',
            children: [
                {
                    title: '體驗課程列表管理',
                    link: '/admin/trials'
                },
            ]
        },
        {
            groupTitle: '首頁管理',
            children: [
                {
                    title: '輪播圖片管理',
                    link: '/admin/home/carousels'
                },
                {
                    title: '服務項目管理',
                    link: '/admin/home/services'
                },
                {
                    title: '體驗課程管理',
                    link: '/admin/home/trials'
                },
                {
                    title: '客戶好評管理',
                    link: '/admin/home/comments'
                },
                {
                    title: '品牌價值管理',
                    link: '/admin/home/brands'
                },
                {
                    title: '加入我們管理',
                    link: '/admin/home/joinus'
                },
            ]
        },
        {
            groupTitle: '課程介紹管理',
            children: [
                {
                    title: '課程列表管理',
                    link: '/admin/classes'
                },
                {
                    title: '課程系列管理',
                    link: '/admin/class_types'
                },
            ]
        },
        {
            groupTitle: '產品管理',
            children: [
                {
                    title: '產品列表管理',
                    link: '/admin/products'
                },
                {
                    title: '產品系列管理',
                    link: '/admin/product_types'
                },
            ]
        },
    ]
    return (
        <LayoutAdmin>
            <div className="columns-2 lg:columns-3 xl:columns-4 gap-8">
                {menuItems.map((menu, i) => {
                    return (
                        <div key={i} className="rounded-lg border border-[#ccc] break-inside-avoid mb-8">
                            <div className="rounded-tl-lg rounded-tr-lg flex items-center justify-center px-4 py-4 bg-gray-200">
                                <Text>
                                    {menu.groupTitle}
                                </Text>
                            </div>
                            {menu.children.map((child, j, arr) => {
                                return (
                                    <Link key={j} href={child.link}>
                                        <div className={clsx("text-center py-4 cursor-pointer", j < arr.length - 1 ? 'border-b border-b-[#ccc]' : '')}>
                                            {child.title}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </LayoutAdmin>
    )
}
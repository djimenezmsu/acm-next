'use client'
import { User } from "@/data/types"
import { MouseEventHandler, useState } from "react"
import { useLocale } from "./providers/language-dict-provider"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Icon } from "./material/icon"
import { IconButton } from "./material/icon-button"
import Image from "./image"
import { ModalDrawer } from "./transitions/modal-drawer"
import { FilledButton } from "./material/filled-button"

export default function Navbar(
    {
        lang,
        user
    }: {
        lang: string,
        user: User | null
    }
) {

    const [drawerOpen, setDrawerOpen] = useState(false)
    const langDict = useLocale()
    const pathName = usePathname()

    const closeDrawer = () => setDrawerOpen(false)

    const navLinks: { icon: string, href: string, text: string }[] = [
        {
            icon: 'menu',
            href: `/${lang}/events`,
            text: langDict.nav_events
        },
        {
            icon: 'trending_up',
            href: `/${lang}/news`,
            text: langDict.nav_news
        },
        {
            icon: 'mic',
            href: `/${lang}/join`,
            text: langDict.nav_join
        },
        {
            icon: 'music_note',
            href: `/${lang}/about`,
            text: langDict.nav_about
        },
    ]

    return (
        <header className="z-50 w-full h-15 px-7 py-2 box-border sticky top-0 backdrop-blur backdrop-saturate-200 before:w-full before:h-full before:absolute bg-[linear-gradient(var(--md-sys-color-background),transparent)] before:bg-background before:opacity-80 before:z-40 before:top-0 before:left-0">
            {/* nav drawer */}
            <ModalDrawer visible={drawerOpen} onClose={closeDrawer} className='lg:hidden'>
                <ul className='flex flex-col w-full'>
                    {
                        navLinks.map(linkData => <NavDrawerLink
                            key={linkData.href}
                            icon={linkData.icon}
                            href={linkData.href}
                            text={linkData.text}
                            active={pathName === linkData.href}
                            onClick={closeDrawer}
                        />)
                    }
                    <NavDrawerLink
                        key='settings'
                        icon='settings'
                        href={`/${lang}/settings`}
                        text={langDict.settings_title}
                        active={pathName === `/${lang}/settings`}
                        onClick={closeDrawer}
                    />
                </ul>
            </ModalDrawer>

            <nav className='z-40 relative w-full h-full flex items-center gap-5 m-auto'>
                <ul className='flex-1 flex items-center justify-start gap-5'>
                    {/* modal nav drawer button */}
                    <IconButton icon='menu' className='lg:hidden flex' onClick={() => setDrawerOpen(true)} />

                    {/* favicon */}
                    <Link href={`/${lang}`} className="flex gap-2">
                        <Image height={32} width={32} src='/msu-shield.png' alt={langDict.home_title}/>
                        <Image height={32} width={32} src='/acm-logo.png' alt={langDict.home_title}/>
                    </Link>

                    {/* nav links */}
                    <div key='nav-links'>
                        <ul className='md:flex hidden gap-5'>
                            {
                                navLinks.map(linkData => <NavLink
                                    key={linkData.href}
                                    href={linkData.href}
                                    text={linkData.text}
                                />)
                            }
                        </ul>
                    </div>
                </ul>

                {/* login/account button */}
                {user ? (
                    <Link href={`/${lang}/account`} className="relative bg-surface-container text-base transition-colors hover:text-primary text-on-surface font-semibold rounded-full h-10 w-fit px-3 gap-3 flex items-center before:transition-opacity before:absolute before:w-full before:h-full before:left-0 before:top-0 before:rounded-full before:opacity-0 before:bg-primary before:hover:opacity-[0.05]">
                        <Image
                            height={28}
                            width={28}
                            src={user.picture}
                            alt={user.givenName}
                            className="rounded-full object-cover"
                        />
                        {user.givenName}
                    </Link>
                ) : <FilledButton text={langDict.nav_login} href='/api/oauth' />
                }

                {/* settings button */}
                <IconButton icon='settings' className='sm:flex hidden' href={`/${lang}/settings`} />
            </nav>
        </header>
    )

}

function NavLink({
    href,
    text
}: {
    href: string,
    text: string
}) {
    return (
        <li key={text}>
            <Link href={href} className='text-on-background bg-transparent rounded-lg bold text-base font-bold box-border p-[5px] hover:text-primary transition-colors'>{text}</Link>
        </li>
    )
}

function NavDrawerLink(
    {
        href,
        text,
        icon,
        active,
        onClick
    }: {
        href: string,
        text: string,
        icon: string,
        active?: boolean,
        onClick?: MouseEventHandler
    }
) {
    return (
        <li key={text}>
            <Link href={href} onClick={onClick} className={`flex items-center justify-start gap-5 w-full h-14 rounded-full px-4 transition-colors ${active ? 'text-on-secondary-container bg-secondary-container' : 'text-on-surface-variant hover:text-on-surface'}`}>
                <Icon icon={icon} />
                <div className='text-lg text-inherit'>{text}</div>
            </Link>
        </li>
    )
}
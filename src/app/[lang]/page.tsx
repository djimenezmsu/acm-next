import Image from "@/components/image"
import { FilledButton } from "@/components/material/filled-button"
import { getActiveSession } from "@/lib/oauth"
import { Locale, getDictionary } from "@/localization"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function Home(
  {
    params
  }: {
    params: {
      lang: Locale
    }
  }
) {
  const locale = params.lang
  const langDict = await getDictionary(locale)
  const session = await getActiveSession(cookies()).catch(error => null)

  return (
    <article className="w-full flex flex-col gap-5 items-center justify-center pt-9">
      {session ? <h1 className="text-on-surface font-extrabold md:text-6xl text-4xl w-full text-center">Welcome {session.user.givenName}</h1> : undefined}
      <section className="w-full flex flex-col justify-start items-center gap-8 mt-28">
        <Image
          className="w-full max-w-32"
          src='/acm-logo.png'
          alt={langDict.home_title}
        />
        <h1 className="text-on-surface font-extrabold md:text-6xl text-4xl w-full text-center">{langDict.home_title}</h1>
        <h2 className="text-on-surface-variant text-center text-xl w-full max-w-2xl">{langDict.home_description}</h2>
        <FilledButton
          text={langDict.home_join}
          href='/join'
          className="sm:w-fit w-full"
        />
      </section>
      <section className="w-full max-w-7xl mt-16"><ul className="w-full flex gap-5 flex-wrap">
        <HomeCard
          title={langDict.home_events_title}
          description={langDict.home_events_description}
          href="/events"
        />
        <HomeCard
          title={langDict.home_news_title}
          description={langDict.home_news_description}
          href="/news"
        />
        <HomeCard
          title={langDict.home_about_title}
          description={langDict.home_about_description}
          href="/about"
        />
        <HomeCard
          title={langDict.home_join_title}
          description={langDict.home_join_description}
          href="/join"
        />
      </ul>
      </section>
    </article>
  )
}

function HomeCard(
  {
    title,
    description,
    href
  }: {
    title: string,
    description: string,
    href: string
  }
) {
  return (
    <li className="md:flex-1 w-full min-w-56"><Link href={href} className="p-5 text-on-surface hover:text-primary flex flex-col gap-3 border-outline-variant transition-colors border rounded-3xl hover:bg-surface-container-lowest">
      <h4 className="text-lg w-full font-bold text-inherit transition-colors">{title}</h4>
      <p className="text-md text-on-surface-variant w-full">{description}</p>
    </Link></li>
  )
}
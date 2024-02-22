import Image from "@/components/image"
import { Locale, getDictionary } from "@/localization"

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

  return (
    <article className="w-full flex flex-col gap-5 items-center justify-center pt-9">
      <Image
        className="w-full max-w-32"
        src='/acm-logo.png'
        alt={langDict.home_title}
      />
      <h1 className="text-on-surface font-extrabold text-4xl w-full text-center">{langDict.home_construction}</h1>
    </article>
  )

}
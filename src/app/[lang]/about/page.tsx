import { Divider } from "@/components/material/divider";
import { FilledButton } from "@/components/material/filled-button";

export default async function About() {
    return (
        <article className="w-full max-w-6xl flex flex-col gap-5 mt-20  text-on-surface">
            <h1 className="text-on-surface font-bold text-4xl ">About Us</h1>
            <Divider></Divider>
            <section className="w-full flex flex-col gap-5">
                <h2 className="text-on-surface font-bold text-2xl">ACM</h2>
                <p>The ACM, or Association for Computing Machinery, brings together computing educators, researchers, and professionals to inspire dialogue, share resources, and address the field&apos;s challenges.</p>
                <p>The Murray State University ACM is a chapter of this greater organization.</p>
                <FilledButton text="Join Today" className="w-fit" href="/join"/>
            </section>
            <Divider></Divider>
            <section className="w-full flex flex-col gap-5">
                <h2 className="text-on-surface font-bold text-2xl">Rewards Program</h2>
                <p>Every semester, the ACM runs an awards program to win an Amazon gift card.</p>
                <p>Whenever one attends a meeting, they will receive a set number of points, adding to their accumulated total over the course of the semester.</p>
                <p>The person with the most points will receive the gift card at the end of the semester.</p>
            </section>
            <Divider></Divider>
            <section className="w-full flex flex-col gap-5">
                <h2 className="text-on-surface font-bold text-2xl">Events</h2>
                <p>Our chapter of the ACM hosts various events throughout the school semester, including workshops, speakers, and game nights.</p>
                <p>We typically have a meeting every Wednesday at 4:00 PM in Business Building 454.</p>
                <FilledButton text="View Events" className="w-fit" href="/events"/>
            </section>
        </article>
    )
}
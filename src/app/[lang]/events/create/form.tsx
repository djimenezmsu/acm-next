'use client'

import { CreateEventActionState, createEvent } from "@/app/actions/create-event"
import { InputSection } from "@/components/input/input-section"
import { SelectInput, SelectInputOption } from "@/components/input/select-input"
import { TextInputElement } from "@/components/input/text-input"
import { UTCDateInput } from "@/components/input/utc-date-input"
import { Divider } from "@/components/material/divider"
import { FilledButton } from "@/components/material/filled-button"
import { useLocale } from "@/components/providers/language-dict-provider"
import { AccessLevel } from "@/data/types"
import { useFormState, useFormStatus } from "react-dom"

const initialFormState = {
    error: undefined
} as CreateEventActionState

const visiblityOptions: SelectInputOption[] = []

export function CreateEventForm(
    {
        eventTypeOptions
    }: {
        eventTypeOptions: SelectInputOption[]
    }
) {
    const [formState, formAction] = useFormState(createEvent, initialFormState)
    const { pending } = useFormStatus()
    const langDict = useLocale()

    return (
        <form className="flex flex-col gap-5 w-full" action={formAction}>
            <section className="flex gap-5 items-end">
                <h1 className="text-on-surface md:text-5xl text-4xl font-bold w-full">{langDict.new_event_title}</h1>
                <FilledButton text={'Create'} disabled={pending} />
            </section>
            <Divider />

            {/* Error */}
            {formState.error ? <h2 className="text-2xl rounded-2xl px-5 py-3 bg-error font-bold text-on-error">{formState.error}</h2> : undefined}

            {/* Title Input */}
            <InputSection title={langDict.new_event_title_field}>
                <TextInputElement
                    name='title'
                    placeholder={langDict.new_event_title_field_placeholder}
                    maxLength={128}
                    required
                />
            </InputSection>

            {/* Location Input */}
            <InputSection title={langDict.new_event_location_field}>
                <TextInputElement
                    name='location'
                    placeholder={langDict.new_event_location_field_placeholder}
                    maxLength={52}
                    required
                />
            </InputSection>

            {/* Dates Section */}
            <section className="flex gap-5">
                <InputSection title={langDict.new_event_start_field}>
                    <UTCDateInput
                        name='start-date'
                        required
                    />
                </InputSection>
                <InputSection title={langDict.new_event_end_field}>
                    <UTCDateInput
                        name='end-date'
                        required
                    />
                </InputSection>
            </section>

            {/* Type Section */}
            <InputSection title={langDict.new_event_type_field}>
                <SelectInput
                    name='type'
                    options={eventTypeOptions}
                />
            </InputSection>

            {/* Access Level Section */}
            <InputSection title={langDict.new_event_type_field}>
                <SelectInput
                    name='access-level'
                    options={[
                        {
                            name: langDict.new_event_visibility_all,
                            value: String(AccessLevel.NON_MEMBER)
                        },
                        {
                            name: langDict.new_event_visibility_restricted,
                            value: String(AccessLevel.OFFICER)
                        }
                    ]}
                />
            </InputSection>

        </form>
    )
}
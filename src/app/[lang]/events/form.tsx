'use client'

import { EventActionState } from "@/app/actions/create-event"
import { InputSection } from "@/components/input/input-section"
import { SelectInput, SelectInputOption } from "@/components/input/select-input"
import { TextInputElement } from "@/components/input/text-input"
import { UTCDateInput } from "@/components/input/utc-date-input"
import { Divider } from "@/components/material/divider"
import { FilledButton } from "@/components/material/filled-button"
import { useLocale } from "@/components/providers/language-dict-provider"
import { AccessLevel, Id } from "@/data/types"
import { useFormState, useFormStatus } from "react-dom"

const initialFormState = {
    error: undefined
} as EventActionState

export interface EventFormValues {
    id?: string,
    title?: string,
    location?: string,
    startDate?: string,
    endDate?: string,
    type?: number,
    accessLevel?: number
}

export function EventForm(
    {
        title,
        values,
        actionText,
        action,
        eventTypeOptions
    }: {
        title: string
        values: EventFormValues
        actionText: string,
        action: (prevState: EventActionState, formData: FormData) => Promise<EventActionState>
        eventTypeOptions: SelectInputOption[]
    }
) {
    const [formState, formAction] = useFormState(action, initialFormState)
    const { pending } = useFormStatus()
    const langDict = useLocale()

    return (
        <form className="flex flex-col gap-5 w-full" action={formAction}>
            <input type='text' name='id' value={values.id} hidden />
            <section className="flex gap-5 items-end">
                <h1 className="text-on-surface md:text-5xl text-4xl font-bold w-full">{title}</h1>
                <FilledButton text={actionText} disabled={pending} />
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
                    value={values.title}
                    required
                />
            </InputSection>

            {/* Location Input */}
            <InputSection title={langDict.new_event_location_field}>
                <TextInputElement
                    name='location'
                    placeholder={langDict.new_event_location_field_placeholder}
                    maxLength={52}
                    value={values.location}
                    required
                />
            </InputSection>

            {/* Dates Section */}
            <section className="flex gap-5">
                <InputSection title={langDict.new_event_start_field}>
                    <UTCDateInput
                        name='start-date'
                        value={values.startDate ? new Date(values.startDate) : undefined}
                        required
                    />
                </InputSection>
                <InputSection title={langDict.new_event_end_field}>
                    <UTCDateInput
                        name='end-date'
                        value={values.endDate ? new Date(values.endDate) : undefined}
                        required
                    />
                </InputSection>
            </section>

            {/* Type Section */}
            <InputSection title={langDict.new_event_type_field}>
                <SelectInput
                    name='type'
                    options={eventTypeOptions}
                    value={values.type}
                    required
                />
            </InputSection>

            {/* Access Level Section */}
            <InputSection title={langDict.new_event_visibility_field}>
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
                    value={values.accessLevel}
                    required
                />
            </InputSection>

        </form>
    )
}
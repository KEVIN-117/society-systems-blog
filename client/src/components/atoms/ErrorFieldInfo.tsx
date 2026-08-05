import type { AnyFieldApi } from '@tanstack/react-form-nextjs';


export function ErrorFieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <>
                    {field.state.meta.errors.map((error, index) => (
                        <span key={index} className="text-red-500 text-xs mt-1 block">{error.message}</span>
                    ))}
                </>
            ) : null}
        </>
    )
}
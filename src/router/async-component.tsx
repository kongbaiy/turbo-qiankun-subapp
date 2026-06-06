import React from 'react'

const loadingElement = (
    <div className='flex justify-center items-center h-100vh'>Loading...</div>
)

export const asyncComponent = (
    callback: () => Promise<{
        default: React.ComponentType<any>
    }>,
) => {
    const Component = React.lazy(callback)

    return (
        <React.Suspense fallback={loadingElement}>
            <Component />
        </React.Suspense>
    )
}

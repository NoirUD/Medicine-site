export default function DashboardLoading() {
    return (
        <div className='animate-pulse flex space-x-4 p-4 bg-zinc-100 rounded-lg w-full'>
            <div className='flex-1 space-y-4 py-1'>
                <div className='h-4 bg-zinc-300 rounded w-3/4' />
                <div className='space-y-2'>
                    <div className='h-4 bg-zinc-300 rounded' />
                    <div className='h-4 bg-zinc-300 rounded w-5/6' />
                </div>
            </div>
        </div>
    )
}
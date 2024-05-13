export default function NotFound() {
 return (
  // 112 px is double the height of the navbar, to center the content
  <main className='flex h-[calc(100vh-112px)] items-center justify-center text-center'>
   <div className='space-y-3 px-3 py-10'>
    <h1 className='text-4xl font-bold'>Not Found</h1>
    <p className='text-muted-foreground'>This page does not exist</p>
   </div>
  </main>
 );
}

import Client from './component.client';

export default async function Page() {
 return (
  <main className='my-4 px-3 py-10'>
   <section className='mx-auto max-w-7xl space-y-6'>
    <div className='mx-auto max-w-2xl'>
     <Client />
    </div>
   </section>
  </main>
 );
}

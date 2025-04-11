import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import Form from 'next/form'

export default function Example() {
  return (

    <main>
        <div className="py-26 sm:py-26">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Form action="/search">
              <input name="query" />
              <button type="submit">Submit</button>
            </Form>
            </div>
        </div>
    </main>

    
  )
}

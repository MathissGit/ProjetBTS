import CreateReservation from "./create-reservation"

export default function PageCreateReservation() {
    return <main>
        <div className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="border border-black p-8 rounded-lg mx-auto">
                    <CreateReservation />
                </div>
            </div>
        </div>
    </main>
}

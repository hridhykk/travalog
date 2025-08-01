const details = [
    {
        id: 1,
        title: "Professinal tour guide",
        discribtion: "Professional tour guides are knowledgeable individuals who provide valuable insights and information about a destination, enhancing the travel experience for tourists.",
        icon: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1753870531/tour-guide_bqca20.png"
    },
    {
        id: 2,
        title: "Certfied travel agency",
        discribtion: "Certified travel agencies are recognized for their professionalism and adherence to industry standards, ensuring travelers receive reliable and high-quality services.",
        icon: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1753870531/certified_vveboa.png"
    }, {
        id: 3,
        title: "24/7 customer support",
        discribtion: "24/7 customer support ensures that travelers can receive assistance and resolve issues at any time, enhancing their overall travel experience.",
        icon: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1753870531/support_fdqkjg.png"
    }
]
const Wustwu = () => {
    return (
        <div className='w-full bg-emerald-50 mt-24 py-12'>
            <div className='container text-center'>
                <h1 className='font-bold  mb-10'>Why You Should Travel With Us</h1>
                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-2
                        lg:grid-cols-3
                        gap-8
                        sm:grid-rows-2
                        md:grid-rows-2
                        lg:grid-rows-1
                    "
                >
                    {/* First card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center p-8 transition-transform hover:scale-105 w-full max-w-xs mx-auto">
                        <img src={details[0].icon} alt={details[0].title} className="w-16 h-16 mb-4" />
                        <h2 className="font-semibold text-lg mb-2">{details[0].title}</h2>
                        <p className="text-gray-600 text-center">{details[0].discribtion}</p>
                    </div>
                    {/* Second card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center p-8 transition-transform hover:scale-105 w-full max-w-xs mx-auto">
                        <img src={details[1].icon} alt={details[1].title} className="w-16 h-16 mb-4" />
                        <h2 className="font-semibold text-lg mb-2">{details[1].title}</h2>
                        <p className="text-gray-600 text-center">{details[1].discribtion}</p>
                    </div>
                    {/* Third card */}
                    <div
                        className="
                            bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center p-8 transition-transform hover:scale-105
                            w-full max-w-xs mx-auto
                            sm:col-span-2 sm:col-start-1 sm:col-end-3 sm:row-start-2
                            md:col-span-2 md:col-start-1 md:col-end-3 md:row-start-2
                            lg:col-span-1 lg:col-start-auto lg:col-end-auto lg:row-start-auto lg:mx-0
                        "
                    >
                        <img src={details[2].icon} alt={details[2].title} className="w-16 h-16 mb-4" />
                        <h2 className="font-semibold text-lg mb-2">{details[2].title}</h2>
                        <p className="text-gray-600 text-center">{details[2].discribtion}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Wustwu
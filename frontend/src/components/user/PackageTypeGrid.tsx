import { Icon } from "lucide-react"

const packageTypes = [{
    id: 0,
    title: "Domestic Trip",
    icon: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1753783031/domestic_zh6cjl.png"
},
{
    id: 1,
    title: "International Trip",
    icon: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1753783032/tourism_pcsrls.png"
},
{
    id: 2,
    title: "Adventure Trip",
    icon: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1753783032/hiking_ufmjx8.png"
},
{
    id: 3,
    title: "Family Package",
    icon: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1753783031/family_dkdrma.png"
},
{
    id: 4,
    title: "Couple Friendly",
    icon: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1753783032/parents_1_yj0jjv.png"
},
{
    id: 5,
    title: "Honeymoon Package",
    icon: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1753783032/honey-moon_gbxvil.png"
},
{
    id: 6,
    title: "Budget Friendly",
    icon: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1753783032/budget-friendly_zkfokj.png"
},
{
    id: 7,
    title: "Luxury Package",
    icon: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1753783031/luxury_uy78n5.png"
}
]

const PackageTypeGrid = () => {
    return (
        <div className="w-full bg-sky-50 pb-16 mt-20 ">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-4 py-8 px-4">
                    <h1 className="font-bold text-center">
                        Package Types
                    </h1>
                    <p className="max-w-md md:max-w-lg mx-auto text-center">
                        Select the perfect package type for your dream trip.
                    </p>
                </div>

                <div className="grid place-items-center gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {packageTypes.map((packageItem) => (
                        <div
                            key={packageItem.id}
                            className="flex flex-col items-center text-center transition-transform duration-300 ease-in-out hover:scale-105 hover:cursor-pointer"
                        >
                            <img
                                src={packageItem.icon}
                                alt={packageItem.title}
                                className="h-12 md:h-20 object-contain mb-2 transition-all duration-300 ease-in-out"
                            />
                            <h6>{packageItem.title}</h6>
                        </div>
                    ))}
                </div>

            </div>
        </div>

    );
};


export default PackageTypeGrid
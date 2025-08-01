import React from 'react'
import Divider from '@mui/material/Divider';

const details = [
    {
        id: 1,
        title: "Tours Completed",
        value: "500+",
        icon: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1753886191/location_druwb8.png"
    }, {
        id: 2,
        title: "Happy Travellers",
        value: "10k+",
        icon: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1753886191/customer-service_nydql6.png"
    }, {
        id: 3,
        title: "Positive Reviews",
        value: "98%",
        icon: "https://res.cloudinary.com/dsqeab5bm/image/upload/v1753886190/review_hspfxn.png"
    }
]
const KeyMetrics = () => {
    return (
        <div>
            <div className="container mx-auto px-4 py-14">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
                    {details.map((item, idx) => (
                        <React.Fragment key={item.id}>
                            <div className="flex items-center px-8">
                                <img src={item.icon} alt={item.title} className="w-14 h-14 mr-4" />
                                <div className="flex flex-col items-start">
                                    <span className="text-3xl font-extrabold text-emerald-700 mb-1">{item.value}</span>
                                    <span className="text-gray-600 font-medium">{item.title}</span>
                                </div>
                            </div>
                            {idx < details.length - 1 && (
                                <Divider orientation="vertical" flexItem className="hidden md:block mx-4" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default KeyMetrics
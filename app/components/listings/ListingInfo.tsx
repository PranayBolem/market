'use client';

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import { IconType } from "react-icons";
import Avatar from "../Avatar";
import Heading from "../Heading";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";

const Map = dynamic (() => import('../Map'), {
    ssr: false
});

interface ListingInfoProps {
    user: SafeUser;
    description: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    category: {
        icon: IconType;
        label: string;
        description: string;
    } | undefined
    locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
    user,
    description,
    guestCount,
    roomCount,
    bathroomCount,
    category,
    locationValue
}) => {
    const {getByValue} = useCountries();
    const location = getByValue(locationValue);
    const coordinates = getByValue(locationValue)?.latlng;

    return(
        <div className="col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <div className="pb-4">
                    <Heading
                        title={`${location?.region}, ${location?.label}`}
                        subtitle={`${guestCount} guests, ${roomCount} bed, ${bathroomCount} bath`}
                    />
                </div>
                <div className="
                    text-xl
                    font-semibold
                    flex
                    flex-row
                    items-center
                    gap-2
                ">
                    <div className="pl-2 pb-2">
                        <Avatar src={user?.image}/>
                    </div>
                    <div className="pl-2 pb-2">Hosted by {user?.name}</div>
                </div>
                <hr/>
                <div className="pt-2 pb-2">
                    {category && (
                        <ListingCategory
                            icon={category.icon}
                            label={category.label}
                            description={category.description}
                        />
                    )}
                </div>
                <hr/>
                <div className="pt-2 text-lg font-light text-neutral-500">
                    {description}
                </div>
                <hr/>
                <div className="pt-2">
                    <Map center={coordinates} />
                </div>
                {/* <div className="
                    flex 
                    flex-row 
                    items-center
                    gap-4
                    font-light
                    text-neutral-500
                    ">
                        <div>
                            {guestCount} guests
                        </div>
                        <div>
                            {roomCount} rooms
                        </div>
                        <div>
                            {bathroomCount} bathrooms
                        </div>
                </div> */}

            </div>
        </div>
    );
}

export default ListingInfo;
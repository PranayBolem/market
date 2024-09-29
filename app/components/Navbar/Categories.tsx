'use client';
import Container from "../Container";
import { BsStars } from 'react-icons/bs';
import { FaHouseFloodWater } from 'react-icons/fa6';
import { GiField, GiWoodCabin, GiIsland, GiCampingTent, GiCaveEntrance, GiBarn } from 'react-icons/gi'
import { CiHome } from 'react-icons/ci'
import { TbBeach, TbDiamond } from 'react-icons/tb';
import { GiWindmill } from 'react-icons/gi';
import { MdOutlineVilla } from 'react-icons/md';
import { LiaSwimmingPoolSolid } from 'react-icons/lia'
import { FaSkiing } from 'react-icons/fa'
import { PiCastleTurret, PiCactus } from 'react-icons/pi'
import { IoSnowOutline } from 'react-icons/io5'
import CategoryBox from "../CategoryBox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const categories = [
    {
        label: 'Celebs',
        icon: BsStars,
        description: 'Properties promoted by celebrities'
    },
    {
        label: 'Lakefront',
        icon: FaHouseFloodWater,
        description: 'Properties listed here are close to lakes'
    },
    {
        label: 'Cabins',
        icon: GiWoodCabin,
        description: 'Properties listed here are wood cabins'
    },
    {
        label: 'Tiny homes',
        icon: CiHome,
        description: 'Properties listed here are tiny homes'
    },
    {
        label: 'Beach',
        icon: TbBeach,
        description: 'Properties listed here are close to beaches'
    },
    {
        label: 'Windmills',
        icon: GiWindmill,
        description: 'Properties listed here are close to windmills'
    },
    {
        label: 'Modern',
        icon: MdOutlineVilla,
        description: 'Properties listed here have modern architecture'
    },
    {
        label: 'Countryside',
        icon: GiField,
        description: 'Properties listed here are at country side'
    },
    {
        label: 'Amazing pools',
        icon: LiaSwimmingPoolSolid,
        description: 'Properties listed here have a swimming pool'
    },
    {
        label: 'Islands',
        icon: GiIsland,
        description: 'Properties listed here are on an island'
    },
    {
        label: 'Ski in/out',
        icon: FaSkiing,
        description: 'Properties listed here have a snowy entrance'
    },
    {
        label: 'Castles',
        icon: PiCastleTurret,
        description: 'Properties listed here are castles'
    },
    {
        label: 'Camping',
        icon: GiCampingTent,
        description: 'Properties listed here are camps'
    },
    {
        label: 'Arctic',
        icon: IoSnowOutline,
        description: 'Properties listed here are in colder parts of Earth'
    },
    {
        label: 'Caves',
        icon: GiCaveEntrance,
        description: 'Properties listed here have are caves'
    },
    {
        label: 'Desert',
        icon: PiCactus,
        description: 'Properties listed here are in a desert'
    },
    {
        label: 'Barns',
        icon: GiBarn,
        description: 'Properties listed here have a barn'
    },
    {
        label: 'Luxe',
        icon: TbDiamond,
        description: 'Properties listed here are luxurious'
    },
]

const Categories = () => {
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();

    // showing the categories only if the user is in the home page/ main page
    const isMainPage = pathname === '/';
    if (!isMainPage) {
        return null;
    }

    return (
        <Container>
            <div className="
            pt-2
            flex
            flex-row
            items-center
            justify-between
            overflow-x-auto">
                {categories.map((item) => (
                    <CategoryBox 
                        key = {item.label}
                        label = {item.label}
                        selected = {category === item.label}
                        icon = {item.icon}
                    />
                ))}
            </div>
        </Container>
    );
}

export default Categories;
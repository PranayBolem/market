import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { SafeUser } from "../types";
import useLoginModel from "./useLoginModel";

interface IUseFavourite {
    listingId: string;
    currentUser?: SafeUser | null;
}

const useFavourite = ({
    listingId,
    currentUser
}: IUseFavourite) => {
    const router = useRouter();
    const loginModel = useLoginModel();
    const hasFavourited = useMemo(() => {
        const list = currentUser?.favouriteIds || []; // we dont get an error if there is no current user of if there are no favourites
        return list.includes(listingId);
    }, [currentUser, listingId]);

    // toggling favourites on and off
    const toggleFavourite = useCallback(async (
        e: React.MouseEvent<HTMLDivElement> // event parameter
    ) => {
        e.stopPropagation();
        
        // if the user is not logged in and attempted to like something, open the login box
        if (!currentUser){
            return loginModel.onOpen();
        }

        try {
            let request;

            if (hasFavourited) {
                request = () => axios.delete(`/api/favorites/${listingId}`); // if the listing is already liked then unlike
            } else {
                request = () => axios.post(`/api/favorites/${listingId}`);
            }

            await request();
            router.refresh();
            toast.success('Success');
        } catch (error) {
            toast.error('Something went wrong.');
        }
    }, [currentUser, hasFavourited, listingId, loginModel, router]);

    return {
        hasFavourited,
        toggleFavourite
    }
}

export default useFavourite;


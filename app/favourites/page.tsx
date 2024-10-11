import EmptyState from "../components/Navbar/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getFavouriteListings from "../actions/getFavouriteListings";
import FavouritesClient from "./FavouritesClient";

const ListingPage = async () => {
    const listings = await getFavouriteListings();
    const currentUser = await getCurrentUser();

    if (listings.length == 0) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="No Favourites found"
                    subtitle="Looks like you have no favourite listings. Add some :)"
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <FavouritesClient 
                listings={listings}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
    
}

export default ListingPage;
import EmptyState from "../components/Navbar/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import TripsClient from "./TripsClient";

const TripsPage = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState 
                    title = "Unauthorized"
                    subtitle = "Please login"
                />
            </ClientOnly>
        )
    }

    const resservations = await getReservations({
        userId: currentUser.id
    });

    if (resservations.length == 0) {
        return(
            <ClientOnly>
                <EmptyState
                    title = "No trips found"
                    subtitle = "looks like you havent reserved any trips."
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <TripsClient 
                reservations = {resservations}
                currentUser = {currentUser}
            />
        </ClientOnly>
    )
}

export default TripsPage;
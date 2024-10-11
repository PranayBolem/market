
import prisma from "@/app/libs/prismadb";

export interface IListingParams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
}

export default async function getListings(
    params: IListingParams
) {
    try {

        const { 
            userId, 
            guestCount,
            roomCount,  
            bathroomCount,
            startDate,
            endDate,
            locationValue,
            category,
        } = params;

        let query: any = {};

        if (userId) {
            query.userId = userId;
        }
        
        if (category) {
            query.category = category;
        }

        if (guestCount) {
            query.guestCount = {
                gte: +guestCount // we are changing the initial string value to a number
            }
        }

        if (roomCount) {
            query.roomCount = {
                gte: +roomCount // we are changing the initial string value to a number
            }
        }

        if (bathroomCount) {
            query.bathroomCount = {
                gte: +bathroomCount // we are changing the initial string value to a number
            }
        }

        if (locationValue) {
            query.locationValue = locationValue;
        }

        if (startDate && endDate) {
            query.NOT = {
                reservations: {
                    some: {
        // if there is just a single day in the reservation then we filter out that conflict because we cant make a full booking using a single date
                        OR: [
                            {
                                endDate: {gte: startDate},
                                startDate: {lte: startDate},
                            },
                            {
                                startDate: {lte: endDate},
                                endDate: {gte: endDate}
                            }
                        ]
                    }
                }
            }
        }

        const listings = await prisma.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }));

        return safeListings;
    } catch (error: any) {
        console.error("Error fetching listings:", error); // Log the actual error
        throw new Error("Failed to fetch listings.");
    }
}
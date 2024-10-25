import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

type Message = {
    role: 'user';
    content: string;
};

export async function POST( req: NextRequest) {
    try {
        const { messages, listingId } = await req.json() as { messages: Message[], listingId: string };

        // console.log("Extracted Listing ID:", listingId);

        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId, // Use the extracted listingId
            },
        });

        if (!listing) {
            const errorMessage = "Sorry, we couldn't find the listing you're looking for. Please check the ID.";
            return NextResponse.json({ botResponse: errorMessage }, { status: 404 });
        }

        const listingDetails = `
            Title: ${listing.title}
            Description: ${listing.description}
            Price: $${listing.price}
            Rooms: ${listing.roomCount}
            Bathrooms: ${listing.bathroomCount}
            Guests: ${listing.guestCount}
            Category: ${listing.category}
            Location: ${listing.locationValue}
            This is a property located in ${listing.locationValue}, categorized as ${listing.category}. 
            It has ${listing.roomCount} rooms, ${listing.bathroomCount} bathrooms, and can accommodate ${listing.guestCount} guests. 
            The property is priced at $${listing.price}. 
            Based on the description: "${listing.description}", imagine how this property might look like. 
            Please answer questions as if you are visualizing the property, highlighting the atmosphere, surroundings, and feel of the home in ${listing.locationValue}.
        `;

        // only send the user messages
        const userMessages = [...messages.map(msg => ({
            role: 'user',
            content: msg.content,
        })),
        {
            role: 'system',
            content: `You are Vally, a real estate expert with knowledge of various types of properties. 
            Use the following details to imagine and describe the property, highlighting its features and answering user questions creatively. ${listingDetails} 
            You provide concise messages with brevity.`,   
        }
    
    ];

        // console.log("Sending the following messages to OpenAI:", userMessages);
  
        // Call OpenAI API using axios
        const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: 'gpt-3.5-turbo',
            messages:
                userMessages,
        },
        {
            headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
            },
        }
        );

        // Extract the bot response from OpenAI's response
        const botResponse = response.data.choices[0].message.content;

        // Send the response back to the client
        return NextResponse.json({ botResponse }, { status: 200 });
        
    } catch (error) {
        console.error('Error in OpenAI API request:', error);
        return NextResponse.json({ message: 'Error in OpenAI API request', error }, { status: 500 });
    }
  }
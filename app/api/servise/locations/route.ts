import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;
  
  // Mock data for 30 unique locations
  const allLocations = [
    {
      id: "loc-1",
      name: "Santorini Oia",
      description: "Experience the world-famous white and blue architecture overlooking the Aegean Sea. Perfect for sunsets and romantic getaways.",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop",
      price: 1200,
      rating: "4.9"
    },
    {
      id: "loc-2",
      name: "Bora Bora Lagoon",
      description: "Luxury overwater bungalows set against a crystal-clear turquoise lagoon and lush tropical greenery.",
      image: "https://images.unsplash.com/photo-1505881502353-a1986add3732?q=80&w=800&auto=format&fit=crop",
      price: 2500,
      rating: "5.0"
    },
    {
      id: "loc-3",
      name: "Swiss Alps Zermatt",
      description: "A haven for skiing and mountain enthusiasts, featuring the iconic Matterhorn peak and alpine charm.",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop",
      price: 1800,
      rating: "4.8"
    },
    {
      id: "loc-4",
      name: "Kyoto Temple Walk",
      description: "Walk through centuries of history with stunning temples, traditional tea houses, and tranquil bamboo forests.",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
      price: 950,
      rating: "4.7"
    },
    {
      id: "loc-5",
      name: "Amalfi Coast",
      description: "Dramatic cliffs, colorful villages, and Mediterranean vibes. Explore Positano and Ravello for the best views.",
      image: "https://images.unsplash.com/photo-1533903345306-15d1c30952de?q=80&w=800&auto=format&fit=crop",
      price: 1500,
      rating: "4.9"
    },
    {
      id: "loc-6",
      name: "Reykjavik Northern Lights",
      description: "Chase the Aurora Borealis in the land of fire and ice. Features geothermal spas and vast volcanic landscapes.",
      image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=800&auto=format&fit=crop",
      price: 2100,
      rating: "4.9"
    },
    {
      id: "loc-7",
      name: "Bali Ubud Forest",
      description: "Immerse yourself in spiritual tranquility with terraced rice paddies and lush tropical jungles.",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
      price: 800,
      rating: "4.6"
    },
    {
      id: "loc-8",
      name: "Machu Picchu Ritual",
      description: "The lost city of the Incas. A breathtaking archaeological wonder set high in the Andes Mountains.",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800&auto=format&fit=crop",
      price: 1350,
      rating: "4.9"
    },
    {
      id: "loc-9",
      name: "New York Manhattan",
      description: "The city that never sleeps. Explore Times Square, Central Park, and the world-class skyline.",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop",
      price: 1100,
      rating: "4.5"
    },
    {
      id: "loc-10",
      name: "Paris Eiffel Tower",
      description: "The city of love. Romantic strolls along the Seine and world-class art at the Louvre.",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
      price: 1400,
      rating: "4.8"
    },
    // Page 2
    {
      id: "loc-11",
      name: "Cairo Great Pyramids",
      description: "Encounter the ancient wonders of the world and the enigmatic Sphinx in the heart of Egypt.",
      image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=800&auto=format&fit=crop",
      price: 700,
      rating: "4.7"
    },
    {
      id: "loc-12",
      name: "Venice Canal Tour",
      description: "Floating city of romantic gondola rides, intricate bridges, and historic palaces over water.",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800&auto=format&fit=crop",
      price: 1300,
      rating: "4.6"
    },
    {
      id: "loc-13",
      name: "Cape Town Safari",
      description: "Explore the wild beauty of South Africa, from Table Mountain to the penguin beaches.",
      image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop",
      price: 2200,
      rating: "4.9"
    },
    {
      id: "loc-14",
      name: "London Big Ben",
      description: "Historic charm meets modern energy. Visit the Tower of London and the vibrant West End.",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
      price: 1250,
      rating: "4.7"
    },
    {
      id: "loc-15",
      name: "Sydney Opera House",
      description: "Iconic architecture set against a stunning harbor. Explore Bondi Beach and the Blue Mountains.",
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=800&auto=format&fit=crop",
      price: 1600,
      rating: "4.8"
    },
    {
      id: "loc-16",
      name: "Prague Old Town",
      description: "Fairytale city of a thousand spires, medieval squares, and the famous Charles Bridge.",
      image: "https://images.unsplash.com/photo-1513807016779-d51c0c026263?q=80&w=800&auto=format&fit=crop",
      price: 850,
      rating: "4.7"
    },
    {
      id: "loc-17",
      name: "Petra Ancient City",
      description: "A rose-gold archaeological marvel carved directly into the desert rock faces of Jordan.",
      image: "https://images.unsplash.com/photo-1579606030107-7429119aa6e6?q=80&w=800&auto=format&fit=crop",
      price: 1450,
      rating: "4.9"
    },
    {
      id: "loc-18",
      name: "Barcelona Gaudí Park",
      description: "Vibrant art, unique architecture, and the sun-soaked Mediterranean lifestyle of Catalonia.",
      image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800&auto=format&fit=crop",
      price: 1050,
      rating: "4.8"
    },
    {
      id: "loc-19",
      name: "Dubrovnik Old City",
      description: "Walk the historic city walls of the 'Pearl of the Adriatic' with stunning sea views.",
      image: "https://images.unsplash.com/photo-1555990538-9e95a01ff2f1?q=80&w=800&auto=format&fit=crop",
      price: 1150,
      rating: "4.8"
    },
    {
      id: "loc-20",
      name: "Marrakech Market",
      description: "A sensory explosion of spices, textiles, and hidden gardens in the heart of Morocco.",
      image: "https://images.unsplash.com/photo-1539020140153-e479b7c2b3df?q=80&w=800&auto=format&fit=crop",
      price: 900,
      rating: "4.6"
    }
  ];

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = allLocations.slice(startIndex, endIndex);
  const hasMore = endIndex < allLocations.length;

  // Add artificial delay to simulate real network conditions
  await new Promise(resolve => setTimeout(resolve, 800));

  return NextResponse.json({
    data: items,
    hasMore: hasMore,
    total: allLocations.length
  });
}

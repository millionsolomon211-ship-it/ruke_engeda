import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;
  
  // Mock data for featured Destinations
  const allDestinations = [
    {
      id: "dest-1",
      name: "Tokyo, Japan",
      description: "Neon lights, ancient temples, and unparalleled culinary experiences in the heart of Japan.",
      image: "https://images.unsplash.com/photo-1540959733332-e94e270b4052?q=80&w=800&auto=format&fit=crop",
      price: 1300,
      rating: "4.9"
    },
    {
      id: "dest-2",
      name: "Rome, Italy",
      description: "Walk through history with the Colosseum, Roman Forum, and iconic Italian pasta.",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop",
      price: 1100,
      rating: "4.8"
    },
    {
      id: "dest-3",
      name: "Tulum, Mexico",
      description: "Bohemian vibes, white sand beaches, and Mayan ruins overlooking the Caribbean Sea.",
      image: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?q=80&w=800&auto=format&fit=crop",
      price: 900,
      rating: "4.7"
    },
    {
      id: "dest-4",
      name: "Vancouver, Canada",
      description: "A perfect blend of urban life and wild nature, surrounded by mountains and the Pacific Ocean.",
      image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?q=80&w=800&auto=format&fit=crop",
      price: 1200,
      rating: "4.8"
    },
    {
      id: "dest-5",
      name: "Seoul, South Korea",
      description: "Dynamic technology, vibrant street food, and historic palaces in a seamless modern mix.",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop",
      price: 1150,
      rating: "4.7"
    },
    {
      id: "dest-6",
      name: "Swiss Oberland",
      description: "Breathtaking landscapes, turquoise lakes, and world-best chocolate in the heart of Europe.",
      image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=800&auto=format&fit=crop",
      price: 2600,
      rating: "5.0"
    },
    {
      id: "dest-7",
      name: "Dubrovnik, Croatia",
      description: "The 'Pearl of the Adriatic' with its stunning limestone streets and medieval fortress walls.",
      image: "https://images.unsplash.com/photo-1555990538-9e95a01ff2f1?q=80&w=800&auto=format&fit=crop",
      price: 1050,
      rating: "4.8"
    },
    {
      id: "dest-8",
      name: "Cusco, Peru",
      description: "Historical gateway to the Incas, filled with colonial charm and spiritual energy.",
      image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800&auto=format&fit=crop",
      price: 1100,
      rating: "4.9"
    }
  ];

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = allDestinations.slice(startIndex, endIndex);
  const hasMore = endIndex < allDestinations.length;

  // Add artificial delay for realism
  await new Promise(resolve => setTimeout(resolve, 600));

  return NextResponse.json({
    data: items,
    hasMore: hasMore,
    total: allDestinations.length
  });
}

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.MONGODB_URI)
db = client[settings.MONGO_DB_NAME]

INITIAL_DATA = {
    "hero": {
        "video_desktop_url": "/Logo Animation 1920x1080 Wider Screens.mp4",
        "video_mobile_url": "/Logo Animation Mobile Screen.mp4",
        "modal_title_join": "Get Blended.",
        "modal_title_login": "Welcome Back.",
        "modal_description": "Join the community. Get early access, exclusive drops, and stories worth reading.",
        "button_text": "Get Blended",
        "button_links": None,
        "is_active": True
    },
    "what_is_tbs": {
        "title": "WHAT IS THE BLENDED STORIES?",
        "paragraphs": [
            "The first social-forward lifestyle magazine where storytelling meets cultural vibe check.",
            "Part Instagram. Part editorial. Part survival guide for navigating the city properly.",
            "From fashion and nightlife to restaurants, travel, beauty, design, and the people shaping culture right now, all in language you're already fluent in."
        ],
        "image_url": "/whatis.png",
        "button_text": "Get Blended",
        "button_link": None,
        "is_active": True
    },
    "what_we_cover": [
        {"image_url": "/whatwecover/Basically, everything shaping the city right now..jpg", "caption": "Basically, everything shaping the city right now.", "display_order": 1, "is_active": True, "visibility": True},
        {"image_url": "/whatwecover/Beauty brands before they become impossible to buy..jpg", "caption": "Beauty brands before they become impossible to buy.", "display_order": 2, "is_active": True, "visibility": True},
        {"image_url": "/whatwecover/Fashion people are actually wearing right now..png", "caption": "Fashion people are actually wearing right now.", "display_order": 3, "is_active": True, "visibility": True},
        {"image_url": "/whatwecover/Hotels you immediately want to check into..jpg", "caption": "Hotels you immediately want to check into.", "display_order": 4, "is_active": True, "visibility": True},
        {"image_url": "/whatwecover/Interiors, aesthetics, and homes worth obsessing over..JPG", "caption": "Interiors, aesthetics, and homes worth obsessing over.", "display_order": 5, "is_active": True, "visibility": True},
        {"image_url": "/whatwecover/Last-minute plans that save the night..jpg", "caption": "Last-minute plans that save the night.", "display_order": 6, "is_active": True, "visibility": True},
        {"image_url": "/whatwecover/The parties, launches, and people having a moment..jpg", "caption": "The parties, launches, and people having a moment.", "display_order": 7, "is_active": True, "visibility": True},
        {"image_url": "/whatwecover/The restaurants everyone suddenly can't get into..jpg", "caption": "The restaurants everyone suddenly can't get into.", "display_order": 8, "is_active": True, "visibility": True},
        {"image_url": "/whatwecover/Travel finds that make you consider booking a flight immediately..jpg", "caption": "Travel finds that make you consider booking a flight immediately.", "display_order": 9, "is_active": True, "visibility": True},
    ],
    "tbs_nights": {
        "video_url": "/tbs-nights.mp4",
        "poster_url": "/tbsnights-hero.png",
        "title": "TBS Nights",
        "subtitle": "The conversations that don't happen online.",
        "paragraphs": [
            "TBS Nights is an intimate dinner series by The Blended Stories that brings together founders, creatives, tastemakers and cultural voices for meaningful conversations beyond likes, algorithms and timelines.",
            "Because the best connections happen when people put their phones down and pull up a chair."
        ],
        "button_text": "JOIN THE WAITLIST",
        "button_link": "/tbs-nights",
        "is_active": True
    },
    "the_edit": [
        {"cover_image_url": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80", "title": "The Restaurants Everyone Suddenly Wants A Table At", "description": "From intimate chef-led experiences to the city's most talked-about openings, these are the reservations becoming increasingly difficult to get.", "story_url": None, "display_number": "01", "display_order": 1, "published": True, "is_active": True},
        {"cover_image_url": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80", "title": "The Fashion Crowd Is Quietly Wearing This Again", "description": "The silhouettes, colours and styling cues showing up everywhere before the rest of the internet catches on.", "story_url": None, "display_number": "02", "display_order": 2, "published": True, "is_active": True},
        {"cover_image_url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80", "title": "Inside The Homes Defining Modern Living", "description": "The designers, spaces and interior ideas influencing how the city is living, entertaining and decorating today.", "story_url": None, "display_number": "03", "display_order": 3, "published": True, "is_active": True},
        {"cover_image_url": "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&q=80", "title": "The Beauty Brands Worth Knowing Before Everyone Else Does", "description": "The products, founders and innovations shaping the next wave of beauty and wellness.", "story_url": None, "display_number": "04", "display_order": 4, "published": True, "is_active": True},
        {"cover_image_url": "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=500&q=80", "title": "Where The City's Most Interesting People Are Spending Their Time", "description": "From cafés and galleries to wellness studios and members' clubs, these are the places currently on our radar.", "story_url": None, "display_number": "05", "display_order": 5, "published": True, "is_active": True},
        {"cover_image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80", "title": "The Art Openings Worth Rearranging Your Week For", "description": "The galleries, shows and emerging artists pulling the city's creative crowd out of their studios.", "story_url": None, "display_number": "06", "display_order": 6, "published": True, "is_active": True},
        {"cover_image_url": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80", "title": "The Playlists Soundtracking Every Good Party Right Now", "description": "The DJs, producers and sets defining the city's nightlife before they hit the mainstream.", "story_url": None, "display_number": "07", "display_order": 7, "published": True, "is_active": True},
        {"cover_image_url": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80", "title": "The Wellness Rituals The City's Insiders Swear By", "description": "From sunrise recovery sessions to the studios fully booked weeks in advance, this is what wellness looks like now.", "story_url": None, "display_number": "08", "display_order": 8, "published": True, "is_active": True},
        {"cover_image_url": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80", "title": "The Founders Building The Next Big Thing", "description": "The entrepreneurs, ideas and ventures quietly reshaping how the city works, shops and connects.", "story_url": None, "display_number": "09", "display_order": 9, "published": True, "is_active": True},
        {"cover_image_url": "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=500&q=80", "title": "The Getaways Everyone Is Quietly Booking", "description": "The destinations, stays and itineraries showing up in every well-travelled group chat this season.", "story_url": None, "display_number": "10", "display_order": 10, "published": True, "is_active": True},
    ],
    "tbs_talks": [
        {"photo_url": "/anita.png", "name": "ANITA DONGRE", "designation": "FASHION DESIGNER\n& ENTREPRENEUR", "date": "MAY 28, 2026", "profile_url": None, "social_link": None, "display_order": 1, "visibility": True, "is_active": True},
        {"photo_url": "/karan.png", "name": "KARAN KAUSHIK", "designation": "ARCHITECT\n& FOUNDER", "date": "MAY 29, 2026", "profile_url": None, "social_link": None, "display_order": 2, "visibility": True, "is_active": True},
        {"photo_url": "/masaba.png", "name": "MASABA GUPTA", "designation": "ENTREPRENEUR\n& CREATOR", "date": "MAY 30, 2026", "profile_url": None, "social_link": None, "display_order": 3, "visibility": True, "is_active": True},
        {"photo_url": "/sarthak.png", "name": "SARTHAK AILAWADI", "designation": "CHEF\n& RESTAURATEUR", "date": "MAY 31, 2026", "profile_url": None, "social_link": None, "display_order": 4, "visibility": True, "is_active": True},
    ],
    "footer": {
        "logo_url": "/TBS LOGO-02 white.png",
        "background_url": "/hero-bg.jpg",
        "quick_links": [{"label": "Lifestyle & Travel", "url": "#"}, {"label": "Fashion", "url": "#"}, {"label": "Beauty & Wellness", "url": "#"}, {"label": "Culture", "url": "#"}, {"label": "Events", "url": "#"}, {"label": "Community", "url": "#"}],
        "locations": [{"label": "Mumbai", "url": "#"}, {"label": "Dubai", "url": "#"}, {"label": "Indore", "url": "#"}, {"label": "Lucknow", "url": "#"}, {"label": "Hyderabad", "url": "#"}, {"label": "Ahmedabad", "url": "#"}],
        "social_links": [
            {"platform": "Facebook", "url": "#"},
            {"platform": "Instagram", "url": "#"},
            {"platform": "Twitter", "url": "#"},
            {"platform": "YouTube", "url": "#"}
        ],
        "copyright": "©2024. All Rights Reserved.",
        "legal_links": [{"label": "Privacy Policy", "url": "#"}, {"label": "Terms of Use", "url": "#"}],
        "email": None,
        "phone": None,
        "is_active": True
    },
    "seo": {
        "title": "The Blended Stories",
        "description": "The first social-forward lifestyle magazine where storytelling meets cultural vibe check.",
        "keywords": "lifestyle, magazine, culture, stories",
        "og_image_url": None,
        "favicon_url": None,
        "is_active": True
    },
    "settings": {
        "website_name": "The Blended Stories",
        "logo_url": None,
        "primary_email": None,
        "phone": None,
        "instagram_url": None,
        "facebook_url": None,
        "linkedin_url": None,
        "youtube_url": None,
        "address": None,
        "is_active": True
    }
}

async def seed():
    print("Starting database seed...")
    for collection_name, data in INITIAL_DATA.items():
        collection = db[collection_name]
        count = await collection.count_documents({})
        if count == 0:
            if isinstance(data, list):
                await collection.insert_many(data)
                print(f"Seeded array collection: {collection_name} with {len(data)} documents")
            else:
                await collection.insert_one(data)
                print(f"Seeded singleton collection: {collection_name}")
        else:
            print(f"Collection {collection_name} is not empty. Skipping seed.")
    print("Seeding completed.")

if __name__ == "__main__":
    asyncio.run(seed())

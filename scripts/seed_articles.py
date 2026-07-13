import json
import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import copy

load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), '../apps/backend/.env')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../apps/backend')))
from app.config import settings

client = MongoClient(settings.MONGODB_URI)
db = client[settings.MONGO_DB_NAME]
articles_collection = db['articles']

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

FALLBACK_IMAGE = "https://res.cloudinary.com/sgtiseox/image/upload/v1783755771/tbs_articles/mdr7bdc5s5t2jyaqwrmm.jpg"

def upload_to_cloudinary(url):
    if not url: return None
    if "res.cloudinary.com" in url: return url
    print(f"Uploading {url} to Cloudinary...")
    try:
        response = cloudinary.uploader.upload(url, folder="tbs_articles")
        return response.get('secure_url', FALLBACK_IMAGE)
    except Exception as e:
        print(f"Failed to upload {url}: {e}. Using fallback.")
        return FALLBACK_IMAGE

seed_articles = json.loads('''[
    {
        "id": 1,
        "slug": "the-restaurants-everyone-suddenly-wants-a-table-at",
        "category": "Lifestyle",
        "subcategory": "Dining",
        "title": "The Restaurants Everyone Suddenly Wants A Table At",
        "description": "From intimate chef-led experiences to the city\'s most talked-about openings, these are the reservations becoming increasingly difficult to get.",
        "author": "Editorial Team",
        "authorImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
        "date": "OCT 24, 2026",
        "readingTime": "5 MIN READ",
        "heroImage": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1440&q=80",
        "galleryImages": [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80",
            "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=500&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80"
        ],
        "videoThumbnail": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80",
        "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
        "relatedArticles": [
            "the-fashion-crowd-is-quietly-wearing-this-again",
            "inside-the-homes-defining-modern-living",
            "the-beauty-brands-worth-knowing"
        ],
        "num": "01",
        "contentBlocks": [
            {
                "id": "legacy-text-0",
                "type": "text",
                "content": "<p>Before an outfit ever reaches the algorithm, it moves through a much smaller room \u2014 a handful of stylists, a few fitting closets, one crowded street corner outside a coffee shop nobody has geotagged yet.</p>"
            },
            {
                "id": "legacy-text-1",
                "type": "text",
                "content": "<p>That\'s where this season\'s real signal is coming from: not the runway recap, but the in-between moments \u2014 the walk from the car to the studio, the after-show coffee run, the six minutes between one appointment and the next. It\'s unstyled by design, which is exactly why it\'s the hardest thing to copy.</p>"
            },
            {
                "id": "legacy-text-2",
                "type": "text",
                "content": "<p>The silhouette doing the quiet rounds this month leans wide through the leg and cropped through the waist, paired with accessories in a single saturated colour \u2014 the kind of contrast that reads as considered rather than loud. It photographs like an accident. It never is.</p>"
            },
            {
                "id": "legacy-text-3",
                "type": "text",
                "content": "<p>Look closely and the accessories tell the real story: a single hard-shell bag in a colour that has no business working with anything else in the outfit, worn like punctuation rather than decoration.</p>"
            },
            {
                "id": "legacy-text-4",
                "type": "text",
                "content": "<p>Expect to see it move faster than most trends do this quarter \u2014 largely because it costs nothing to shoot and everything to fake.</p>"
            }
        ],
        "pull_quote": "It\'s no longer just about the food. The modern dining experience is theater, and these new establishments are putting on a spectacular show.",
        "quote_author": "Anonymous",
        "editorial_note": "This list is curated based on our anonymous dining visits over the past three months. No restaurant has paid for placement.",
        "author_role": "Editor",
        "display_order": 1,
        "featured": true,
        "is_active": true,
        "status": "published"
    },
    {
        "id": 2,
        "slug": "the-fashion-crowd-is-quietly-wearing-this-again",
        "category": "Fashion",
        "subcategory": "Trends",
        "title": "The Fashion Crowd Is Quietly Wearing This Again",
        "description": "The silhouettes, colours and styling cues showing up everywhere before the rest of the internet catches on.",
        "author": "Style Editor",
        "authorImage": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
        "date": "OCT 22, 2026",
        "readingTime": "4 MIN READ",
        "heroImage": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1440&q=80",
        "galleryImages": [
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80",
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80"
        ],
        "videoThumbnail": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
        "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
        "relatedArticles": [
            "the-restaurants-everyone-suddenly-wants-a-table-at",
            "inside-the-homes-defining-modern-living",
            "the-beauty-brands-worth-knowing"
        ],
        "num": "02",
        "contentBlocks": [
            {
                "id": "legacy-text-0",
                "type": "text",
                "content": "<p>Before an outfit ever reaches the algorithm, it moves through a much smaller room \u2014 a handful of stylists, a few fitting closets, one crowded street corner outside a coffee shop nobody has geotagged yet.</p>"
            },
            {
                "id": "legacy-text-1",
                "type": "text",
                "content": "<p>That\'s where this season\'s real signal is coming from: not the runway recap, but the in-between moments \u2014 the walk from the car to the studio, the after-show coffee run, the six minutes between one appointment and the next. It\'s unstyled by design, which is exactly why it\'s the hardest thing to copy.</p>"
            },
            {
                "id": "legacy-text-2",
                "type": "text",
                "content": "<p>The silhouette doing the quiet rounds this month leans wide through the leg and cropped through the waist, paired with accessories in a single saturated colour \u2014 the kind of contrast that reads as considered rather than loud. It photographs like an accident. It never is.</p>"
            },
            {
                "id": "legacy-text-3",
                "type": "text",
                "content": "<p>Look closely and the accessories tell the real story: a single hard-shell bag in a colour that has no business working with anything else in the outfit, worn like punctuation rather than decoration.</p>"
            },
            {
                "id": "legacy-text-4",
                "type": "text",
                "content": "<p>Expect to see it move faster than most trends do this quarter \u2014 largely because it costs nothing to shoot and everything to fake.</p>"
            }
        ],
        "pull_quote": "True style whispers, it doesn\'t shout. What we\'re seeing now is a return to thoughtful, considered dressing over fleeting internet micro-trends.",
        "quote_author": "Anonymous",
        "editorial_note": "All items featured are selected by our editors. The Blended Stories may earn a commission on links.",
        "author_role": "Editor",
        "display_order": 2,
        "featured": true,
        "is_active": true,
        "status": "published"
    },
    {
        "id": 3,
        "slug": "inside-the-homes-defining-modern-living",
        "category": "Lifestyle",
        "subcategory": "Interiors",
        "title": "Inside The Homes Defining Modern Living",
        "description": "The designers, spaces and interior ideas influencing how the city is living, entertaining and decorating today.",
        "author": "Design Desk",
        "authorImage": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
        "date": "OCT 20, 2026",
        "readingTime": "6 MIN READ",
        "heroImage": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1440&q=80",
        "galleryImages": [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80",
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80"
        ],
        "videoThumbnail": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
        "relatedArticles": [
            "the-restaurants-everyone-suddenly-wants-a-table-at",
            "the-fashion-crowd-is-quietly-wearing-this-again",
            "where-the-citys-most-interesting-people-are-spending-their-time"
        ],
        "num": "03",
        "contentBlocks": [
            {
                "id": "legacy-text-0",
                "type": "text",
                "content": "<p>Before an outfit ever reaches the algorithm, it moves through a much smaller room \u2014 a handful of stylists, a few fitting closets, one crowded street corner outside a coffee shop nobody has geotagged yet.</p>"
            },
            {
                "id": "legacy-text-1",
                "type": "text",
                "content": "<p>That\'s where this season\'s real signal is coming from: not the runway recap, but the in-between moments \u2014 the walk from the car to the studio, the after-show coffee run, the six minutes between one appointment and the next. It\'s unstyled by design, which is exactly why it\'s the hardest thing to copy.</p>"
            },
            {
                "id": "legacy-text-2",
                "type": "text",
                "content": "<p>The silhouette doing the quiet rounds this month leans wide through the leg and cropped through the waist, paired with accessories in a single saturated colour \u2014 the kind of contrast that reads as considered rather than loud. It photographs like an accident. It never is.</p>"
            },
            {
                "id": "legacy-text-3",
                "type": "text",
                "content": "<p>Look closely and the accessories tell the real story: a single hard-shell bag in a colour that has no business working with anything else in the outfit, worn like punctuation rather than decoration.</p>"
            },
            {
                "id": "legacy-text-4",
                "type": "text",
                "content": "<p>Expect to see it move faster than most trends do this quarter \u2014 largely because it costs nothing to shoot and everything to fake.</p>"
            }
        ],
        "pull_quote": "A home should be the story of who you are, and a collection of what you love.",
        "quote_author": "Anonymous",
        "editorial_note": "Properties featured are private residences. Respect the owners\' privacy.",
        "author_role": "Editor",
        "display_order": 3,
        "featured": true,
        "is_active": true,
        "status": "published"
    },
    {
        "id": 4,
        "slug": "the-beauty-brands-worth-knowing",
        "category": "Beauty",
        "subcategory": "Wellness",
        "title": "The Beauty Brands Worth Knowing Before Everyone Else Does",
        "description": "The products, founders and innovations shaping the next wave of beauty and wellness.",
        "author": "Beauty Editor",
        "authorImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
        "date": "OCT 18, 2026",
        "readingTime": "4 MIN READ",
        "heroImage": "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1440&q=80",
        "galleryImages": [
            "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=500&q=80",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80"
        ],
        "videoThumbnail": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&q=80",
        "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
        "relatedArticles": [
            "the-wellness-rituals-the-citys-insiders-swear-by",
            "the-fashion-crowd-is-quietly-wearing-this-again",
            "inside-the-homes-defining-modern-living"
        ],
        "num": "04",
        "contentBlocks": [
            {
                "id": "legacy-text-0",
                "type": "text",
                "content": "<p>Before an outfit ever reaches the algorithm, it moves through a much smaller room \u2014 a handful of stylists, a few fitting closets, one crowded street corner outside a coffee shop nobody has geotagged yet.</p>"
            },
            {
                "id": "legacy-text-1",
                "type": "text",
                "content": "<p>That\'s where this season\'s real signal is coming from: not the runway recap, but the in-between moments \u2014 the walk from the car to the studio, the after-show coffee run, the six minutes between one appointment and the next. It\'s unstyled by design, which is exactly why it\'s the hardest thing to copy.</p>"
            },
            {
                "id": "legacy-text-2",
                "type": "text",
                "content": "<p>The silhouette doing the quiet rounds this month leans wide through the leg and cropped through the waist, paired with accessories in a single saturated colour \u2014 the kind of contrast that reads as considered rather than loud. It photographs like an accident. It never is.</p>"
            },
            {
                "id": "legacy-text-3",
                "type": "text",
                "content": "<p>Look closely and the accessories tell the real story: a single hard-shell bag in a colour that has no business working with anything else in the outfit, worn like punctuation rather than decoration.</p>"
            },
            {
                "id": "legacy-text-4",
                "type": "text",
                "content": "<p>Expect to see it move faster than most trends do this quarter \u2014 largely because it costs nothing to shoot and everything to fake.</p>"
            }
        ],
        "pull_quote": "We are moving away from the multi-step routines toward highly effective, science-backed essentials.",
        "quote_author": "Anonymous",
        "editorial_note": "Products were tested by our editorial team over a 4-week period.",
        "author_role": "Editor",
        "display_order": 4,
        "featured": true,
        "is_active": true,
        "status": "published"
    },
    {
        "id": 5,
        "slug": "where-the-citys-most-interesting-people-are-spending-their-time",
        "category": "Culture",
        "subcategory": "City Guide",
        "title": "Where The City\'s Most Interesting People Are Spending Their Time",
        "description": "From caf\u00e9s and galleries to wellness studios and members\' clubs, these are the places currently on our radar.",
        "author": "Culture Desk",
        "authorImage": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
        "date": "OCT 15, 2026",
        "readingTime": "5 MIN READ",
        "heroImage": "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1440&q=80",
        "galleryImages": [
            "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=500&q=80",
            "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80"
        ],
        "videoThumbnail": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
        "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
        "relatedArticles": [
            "the-restaurants-everyone-suddenly-wants-a-table-at",
            "the-art-openings-worth-rearranging-your-week-for",
            "the-playlists-soundtracking-every-good-party-right-now"
        ],
        "num": "05",
        "contentBlocks": [
            {
                "id": "legacy-text-0",
                "type": "text",
                "content": "<p>Before an outfit ever reaches the algorithm, it moves through a much smaller room \u2014 a handful of stylists, a few fitting closets, one crowded street corner outside a coffee shop nobody has geotagged yet.</p>"
            },
            {
                "id": "legacy-text-1",
                "type": "text",
                "content": "<p>That\'s where this season\'s real signal is coming from: not the runway recap, but the in-between moments \u2014 the walk from the car to the studio, the after-show coffee run, the six minutes between one appointment and the next. It\'s unstyled by design, which is exactly why it\'s the hardest thing to copy.</p>"
            },
            {
                "id": "legacy-text-2",
                "type": "text",
                "content": "<p>The silhouette doing the quiet rounds this month leans wide through the leg and cropped through the waist, paired with accessories in a single saturated colour \u2014 the kind of contrast that reads as considered rather than loud. It photographs like an accident. It never is.</p>"
            },
            {
                "id": "legacy-text-3",
                "type": "text",
                "content": "<p>Look closely and the accessories tell the real story: a single hard-shell bag in a colour that has no business working with anything else in the outfit, worn like punctuation rather than decoration.</p>"
            },
            {
                "id": "legacy-text-4",
                "type": "text",
                "content": "<p>Expect to see it move faster than most trends do this quarter \u2014 largely because it costs nothing to shoot and everything to fake.</p>"
            }
        ],
        "pull_quote": "The energy of a city is dictated by the spaces that foster real connection.",
        "quote_author": "Anonymous",
        "editorial_note": "This guide is updated monthly to reflect the changing cultural landscape.",
        "author_role": "Editor",
        "display_order": 5,
        "featured": true,
        "is_active": true,
        "status": "published"
    },
    {
        "id": 6,
        "slug": "the-art-openings-worth-rearranging-your-week-for",
        "category": "Culture",
        "subcategory": "Art",
        "title": "The Art Openings Worth Rearranging Your Week For",
        "description": "The galleries, shows and emerging artists pulling the city\'s creative crowd out of their studios.",
        "author": "Art Critic",
        "authorImage": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
        "date": "OCT 12, 2026",
        "readingTime": "4 MIN READ",
        "heroImage": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1440&q=80",
        "galleryImages": [
            "https://images.unsplash.com/photo-1518998053401-8789131a4731?w=500&q=80",
            "https://images.unsplash.com/photo-1544473244-f67971df222d?w=500&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80"
        ],
        "videoThumbnail": "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=80",
        "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
        "relatedArticles": [
            "where-the-citys-most-interesting-people-are-spending-their-time",
            "the-founders-building-the-next-big-thing",
            "the-fashion-crowd-is-quietly-wearing-this-again"
        ],
        "num": "06",
        "contentBlocks": [
            {
                "id": "legacy-text-0",
                "type": "text",
                "content": "<p>Before an outfit ever reaches the algorithm, it moves through a much smaller room \u2014 a handful of stylists, a few fitting closets, one crowded street corner outside a coffee shop nobody has geotagged yet.</p>"
            },
            {
                "id": "legacy-text-1",
                "type": "text",
                "content": "<p>That\'s where this season\'s real signal is coming from: not the runway recap, but the in-between moments \u2014 the walk from the car to the studio, the after-show coffee run, the six minutes between one appointment and the next. It\'s unstyled by design, which is exactly why it\'s the hardest thing to copy.</p>"
            },
            {
                "id": "legacy-text-2",
                "type": "text",
                "content": "<p>The silhouette doing the quiet rounds this month leans wide through the leg and cropped through the waist, paired with accessories in a single saturated colour \u2014 the kind of contrast that reads as considered rather than loud. It photographs like an accident. It never is.</p>"
            },
            {
                "id": "legacy-text-3",
                "type": "text",
                "content": "<p>Look closely and the accessories tell the real story: a single hard-shell bag in a colour that has no business working with anything else in the outfit, worn like punctuation rather than decoration.</p>"
            },
            {
                "id": "legacy-text-4",
                "type": "text",
                "content": "<p>Expect to see it move faster than most trends do this quarter \u2014 largely because it costs nothing to shoot and everything to fake.</p>"
            }
        ],
        "pull_quote": "Art is not what you see, but what you make others see.",
        "quote_author": "Anonymous",
        "editorial_note": "Exhibition dates are subject to change. Please verify with galleries.",
        "author_role": "Editor",
        "display_order": 6,
        "featured": true,
        "is_active": true,
        "status": "published"
    },
    {
        "id": 7,
        "slug": "the-playlists-soundtracking-every-good-party-right-now",
        "category": "Culture",
        "subcategory": "Music",
        "title": "The Playlists Soundtracking Every Good Party Right Now",
        "description": "The DJs, producers and sets defining the city\'s nightlife before they hit the mainstream.",
        "author": "Music Editor",
        "authorImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
        "date": "OCT 10, 2026",
        "readingTime": "3 MIN READ",
        "heroImage": "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1440&q=80",
        "galleryImages": [
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80"
        ],
        "videoThumbnail": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
        "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
        "relatedArticles": [
            "where-the-citys-most-interesting-people-are-spending-their-time",
            "the-restaurants-everyone-suddenly-wants-a-table-at",
            "the-getaways-everyone-is-quietly-booking"
        ],
        "num": "07",
        "contentBlocks": [
            {
                "id": "legacy-text-0",
                "type": "text",
                "content": "<p>Before an outfit ever reaches the algorithm, it moves through a much smaller room \u2014 a handful of stylists, a few fitting closets, one crowded street corner outside a coffee shop nobody has geotagged yet.</p>"
            },
            {
                "id": "legacy-text-1",
                "type": "text",
                "content": "<p>That\'s where this season\'s real signal is coming from: not the runway recap, but the in-between moments \u2014 the walk from the car to the studio, the after-show coffee run, the six minutes between one appointment and the next. It\'s unstyled by design, which is exactly why it\'s the hardest thing to copy.</p>"
            },
            {
                "id": "legacy-text-2",
                "type": "text",
                "content": "<p>The silhouette doing the quiet rounds this month leans wide through the leg and cropped through the waist, paired with accessories in a single saturated colour \u2014 the kind of contrast that reads as considered rather than loud. It photographs like an accident. It never is.</p>"
            },
            {
                "id": "legacy-text-3",
                "type": "text",
                "content": "<p>Look closely and the accessories tell the real story: a single hard-shell bag in a colour that has no business working with anything else in the outfit, worn like punctuation rather than decoration.</p>"
            },
            {
                "id": "legacy-text-4",
                "type": "text",
                "content": "<p>Expect to see it move faster than most trends do this quarter \u2014 largely because it costs nothing to shoot and everything to fake.</p>"
            }
        ],
        "pull_quote": "The right track at the right moment can elevate a good night into an unforgettable one.",
        "quote_author": "Anonymous",
        "editorial_note": "Links to Spotify and Apple Music playlists are included at the end of the article.",
        "author_role": "Editor",
        "display_order": 7,
        "featured": true,
        "is_active": true,
        "status": "published"
    },
    {
        "id": 8,
        "slug": "the-wellness-rituals-the-citys-insiders-swear-by",
        "category": "Beauty",
        "subcategory": "Wellness",
        "title": "The Wellness Rituals The City\'s Insiders Swear By",
        "description": "From sunrise recovery sessions to the studios fully booked weeks in advance, this is what wellness looks like now.",
        "author": "Wellness Editor",
        "authorImage": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
        "date": "OCT 08, 2026",
        "readingTime": "5 MIN READ",
        "heroImage": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1440&q=80",
        "galleryImages": [
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80",
            "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80"
        ],
        "videoThumbnail": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
        "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
        "relatedArticles": [
            "the-beauty-brands-worth-knowing",
            "the-fashion-crowd-is-quietly-wearing-this-again",
            "inside-the-homes-defining-modern-living"
        ],
        "num": "08",
        "contentBlocks": [
            {
                "id": "legacy-text-0",
                "type": "text",
                "content": "<p>Before an outfit ever reaches the algorithm, it moves through a much smaller room \u2014 a handful of stylists, a few fitting closets, one crowded street corner outside a coffee shop nobody has geotagged yet.</p>"
            },
            {
                "id": "legacy-text-1",
                "type": "text",
                "content": "<p>That\'s where this season\'s real signal is coming from: not the runway recap, but the in-between moments \u2014 the walk from the car to the studio, the after-show coffee run, the six minutes between one appointment and the next. It\'s unstyled by design, which is exactly why it\'s the hardest thing to copy.</p>"
            },
            {
                "id": "legacy-text-2",
                "type": "text",
                "content": "<p>The silhouette doing the quiet rounds this month leans wide through the leg and cropped through the waist, paired with accessories in a single saturated colour \u2014 the kind of contrast that reads as considered rather than loud. It photographs like an accident. It never is.</p>"
            },
            {
                "id": "legacy-text-3",
                "type": "text",
                "content": "<p>Look closely and the accessories tell the real story: a single hard-shell bag in a colour that has no business working with anything else in the outfit, worn like punctuation rather than decoration.</p>"
            },
            {
                "id": "legacy-text-4",
                "type": "text",
                "content": "<p>Expect to see it move faster than most trends do this quarter \u2014 largely because it costs nothing to shoot and everything to fake.</p>"
            }
        ],
        "pull_quote": "True wellness is no longer about punishing workouts; it\'s about recovery, longevity, and listening to your body.",
        "quote_author": "Anonymous",
        "editorial_note": "Consult with a healthcare professional before starting any new fitness or wellness regimen.",
        "author_role": "Editor",
        "display_order": 8,
        "featured": true,
        "is_active": true,
        "status": "published"
    },
    {
        "id": 9,
        "slug": "the-founders-building-the-next-big-thing",
        "category": "Culture",
        "subcategory": "Business",
        "title": "The Founders Building The Next Big Thing",
        "description": "The entrepreneurs, ideas and ventures quietly reshaping how the city works, shops and connects.",
        "author": "Features Writer",
        "authorImage": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
        "date": "OCT 05, 2026",
        "readingTime": "7 MIN READ",
        "heroImage": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1440&q=80",
        "galleryImages": [
            "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=500&q=80",
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80"
        ],
        "videoThumbnail": "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
        "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
        "relatedArticles": [
            "where-the-citys-most-interesting-people-are-spending-their-time",
            "the-restaurants-everyone-suddenly-wants-a-table-at",
            "the-art-openings-worth-rearranging-your-week-for"
        ],
        "num": "09",
        "contentBlocks": [
            {
                "id": "legacy-text-0",
                "type": "text",
                "content": "<p>Before an outfit ever reaches the algorithm, it moves through a much smaller room \u2014 a handful of stylists, a few fitting closets, one crowded street corner outside a coffee shop nobody has geotagged yet.</p>"
            },
            {
                "id": "legacy-text-1",
                "type": "text",
                "content": "<p>That\'s where this season\'s real signal is coming from: not the runway recap, but the in-between moments \u2014 the walk from the car to the studio, the after-show coffee run, the six minutes between one appointment and the next. It\'s unstyled by design, which is exactly why it\'s the hardest thing to copy.</p>"
            },
            {
                "id": "legacy-text-2",
                "type": "text",
                "content": "<p>The silhouette doing the quiet rounds this month leans wide through the leg and cropped through the waist, paired with accessories in a single saturated colour \u2014 the kind of contrast that reads as considered rather than loud. It photographs like an accident. It never is.</p>"
            },
            {
                "id": "legacy-text-3",
                "type": "text",
                "content": "<p>Look closely and the accessories tell the real story: a single hard-shell bag in a colour that has no business working with anything else in the outfit, worn like punctuation rather than decoration.</p>"
            },
            {
                "id": "legacy-text-4",
                "type": "text",
                "content": "<p>Expect to see it move faster than most trends do this quarter \u2014 largely because it costs nothing to shoot and everything to fake.</p>"
            }
        ],
        "pull_quote": "Innovation doesn\'t happen in isolation. It happens when disparate ideas collide in unexpected ways.",
        "quote_author": "Anonymous",
        "editorial_note": "The Blended Stories has no financial interest in any of the companies featured.",
        "author_role": "Editor",
        "display_order": 9,
        "featured": true,
        "is_active": true,
        "status": "published"
    },
    {
        "id": 10,
        "slug": "the-getaways-everyone-is-quietly-booking",
        "category": "Lifestyle",
        "subcategory": "Travel",
        "title": "The Getaways Everyone Is Quietly Booking",
        "description": "The destinations, stays and itineraries showing up in every well-travelled group chat this season.",
        "author": "Travel Editor",
        "authorImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
        "date": "OCT 01, 2026",
        "readingTime": "6 MIN READ",
        "heroImage": "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=1440&q=80",
        "galleryImages": [
            "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500&q=80",
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=80",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80"
        ],
        "videoThumbnail": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
        "videoUrl": "https://www.w3schools.com/html/mov_bbb.mp4",
        "relatedArticles": [
            "inside-the-homes-defining-modern-living",
            "the-restaurants-everyone-suddenly-wants-a-table-at",
            "the-fashion-crowd-is-quietly-wearing-this-again"
        ],
        "num": "10",
        "contentBlocks": [
            {
                "id": "legacy-text-0",
                "type": "text",
                "content": "<p>Before an outfit ever reaches the algorithm, it moves through a much smaller room \u2014 a handful of stylists, a few fitting closets, one crowded street corner outside a coffee shop nobody has geotagged yet.</p>"
            },
            {
                "id": "legacy-text-1",
                "type": "text",
                "content": "<p>That\'s where this season\'s real signal is coming from: not the runway recap, but the in-between moments \u2014 the walk from the car to the studio, the after-show coffee run, the six minutes between one appointment and the next. It\'s unstyled by design, which is exactly why it\'s the hardest thing to copy.</p>"
            },
            {
                "id": "legacy-text-2",
                "type": "text",
                "content": "<p>The silhouette doing the quiet rounds this month leans wide through the leg and cropped through the waist, paired with accessories in a single saturated colour \u2014 the kind of contrast that reads as considered rather than loud. It photographs like an accident. It never is.</p>"
            },
            {
                "id": "legacy-text-3",
                "type": "text",
                "content": "<p>Look closely and the accessories tell the real story: a single hard-shell bag in a colour that has no business working with anything else in the outfit, worn like punctuation rather than decoration.</p>"
            },
            {
                "id": "legacy-text-4",
                "type": "text",
                "content": "<p>Expect to see it move faster than most trends do this quarter \u2014 largely because it costs nothing to shoot and everything to fake.</p>"
            }
        ],
        "pull_quote": "The ultimate luxury today is not opulence, but disconnection\u2014a place where time slows down.",
        "quote_author": "Anonymous",
        "editorial_note": "Prices and availability were correct at time of publication.",
        "author_role": "Editor",
        "display_order": 10,
        "featured": true,
        "is_active": true,
        "status": "published"
    }
]''')

stats = {
    "total_seeded": len(seed_articles),
    "featured": 0,
    "gallery_images": 0,
    "cloudinary_images": 0,
    "related_links": 0,
    "inserted": 0,
    "patched": 0,
    "skipped": 0
}

for article in seed_articles:
    print(f"Processing article: {article['title']}")
    
    if article.get('featured'):
        stats['featured'] += 1
    stats['related_links'] += len(article.get('relatedArticles', []))
    
    existing = articles_collection.find_one({"slug": article['slug']})
    
    # 1. Helper to safely upload image or use existing
    def get_image(key, url):
        if existing and existing.get(key) and 'res.cloudinary.com' in existing.get(key):
            stats['cloudinary_images'] += 1
            return existing.get(key)
        new_url = upload_to_cloudinary(url)
        if new_url and 'res.cloudinary.com' in new_url:
            stats['cloudinary_images'] += 1
        return new_url
        
    def get_gallery(article_data):
        if existing and existing.get('gallery') and len(existing.get('gallery')) > 0:
            stats['gallery_images'] += len(existing.get('gallery'))
            return existing.get('gallery')
            
        new_gallery = []
        for g_url in article_data.get('galleryImages', []):
            new_url = upload_to_cloudinary(g_url)
            new_gallery.append({
                "image": new_url,
                "caption": ""
            })
            if new_url and 'res.cloudinary.com' in new_url:
                stats['cloudinary_images'] += 1
        stats['gallery_images'] += len(new_gallery)
        return new_gallery
        
    def get_video(article_data):
        url = article_data.get('videoUrl')
        thumbnail = article_data.get('videoThumbnail')
        if not url or not thumbnail:
            return None
            
        if existing and existing.get('embedded_video') and 'res.cloudinary.com' in existing['embedded_video'].get('thumbnail', ''):
            return existing.get('embedded_video')
            
        new_thumbnail = upload_to_cloudinary(thumbnail)
        return {
            "url": url,
            "thumbnail": new_thumbnail
        }

    # Prepare document fields
    doc = copy.deepcopy(article)
    doc['hero_image'] = get_image('hero_image', article.get('heroImage'))
    doc['cover_image'] = get_image('cover_image', article.get('heroImage'))
    doc['author_image'] = get_image('author_image', article.get('authorImage'))
    doc['gallery'] = get_gallery(article)
    doc['embedded_video'] = get_video(article)
    
    # Map relatedArticles to related_articles
    doc['related_articles'] = article.get('relatedArticles', [])
    doc['publish_date'] = article.get('date')
    doc['reading_time'] = article.get('readingTime')
    doc['subtitle'] = article.get('description')
    
    # Delete unused source keys
    for k in ['heroImage', 'galleryImages', 'videoUrl', 'videoThumbnail', 'relatedArticles', 'date', 'readingTime', 'description', 'num']:
        if k in doc:
            del doc[k]

    if not existing:
        articles_collection.update_one(
            {"slug": doc['slug']},
            {"$setOnInsert": doc},
            upsert=True
        )
        stats['inserted'] += 1
        print(f"Inserted new article {doc['slug']}")
    else:
        set_fields = {}
        # Only patch missing fields
        for key, value in doc.items():
            if key not in existing or existing[key] is None:
                set_fields[key] = value
                
        if set_fields:
            articles_collection.update_one(
                {"slug": doc['slug']},
                {"$set": set_fields}
            )
            stats['patched'] += 1
            print(f"Patched missing fields on {doc['slug']}: {list(set_fields.keys())}")
        else:
            stats['skipped'] += 1
            print(f"Article {doc['slug']} already fully populated. Skipping.")

print("\n" + "="*50)
print("FINAL REPORT")
print("="*50)
print(f"Total seeded articles:      {stats['total_seeded']}")
print(f"Number of featured articles:{stats['featured']}")
print(f"Number of gallery images:   {stats['gallery_images']}")
print(f"Number of Cloudinary images:{stats['cloudinary_images']}")
print(f"Number of related links:    {stats['related_links']}")
print(f"Articles inserted:          {stats['inserted']}")
print(f"Articles patched:           {stats['patched']}")
print(f"Articles skipped:           {stats['skipped']}")
print("="*50)

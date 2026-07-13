import json
import os

with open('articles_data_10.json', 'r') as f:
    data = json.load(f)

# transform the data to match new schema format for contentBlocks
for article in data:
    # ensure string content array is transformed to contentBlocks if needed
    if 'content' in article and isinstance(article['content'], list):
        blocks = []
        for i, text in enumerate(article['content']):
            blocks.append({
                "id": f"legacy-text-{i}",
                "type": "text",
                "content": f"<p>{text}</p>"
            })
        article['contentBlocks'] = blocks
        del article['content']
    
    # Map quote to contentBlocks if it exists
    if 'quote' in article:
        article['pull_quote'] = article['quote']
        article['quote_author'] = "Anonymous" # Mock
        del article['quote']
        
    if 'editorNote' in article:
        article['editorial_note'] = article['editorNote']
        del article['editorNote']
        
    article['author_role'] = 'Editor'
    article['display_order'] = int(article['num'])
    article['featured'] = True
    article['is_active'] = True
    article['status'] = 'published'

script_code = """import json
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

seed_articles = json.loads('''""" + json.dumps(data, indent=4).replace("'", "\\'") + """''')

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

print("\\n" + "="*50)
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
"""

with open('scripts/seed_articles.py', 'w') as f:
    f.write(script_code)
print("Wrote scripts/seed_articles.py")

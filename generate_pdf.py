import sys
from PIL import Image

images_paths = [
    '/Users/ryp/.gemini/antigravity/brain/0480b15c-51d0-4d24-a67f-985fe0dc083e/vokasi_stripe_neumorphic_hero_1777033689571.png',
    '/Users/ryp/.gemini/antigravity/brain/0480b15c-51d0-4d24-a67f-985fe0dc083e/vokasi_neumorphic_courses_1777034178353.png',
    '/Users/ryp/.gemini/antigravity/brain/0480b15c-51d0-4d24-a67f-985fe0dc083e/vokasi_neumorphic_team_1777034240057.png'
]

images = [Image.open(img).convert('RGB') for img in images_paths]

images[0].save(
    '/Users/ryp/Antigratvity/Vokasi.ai/Vokasi_Redesign_Preview.pdf',
    save_all=True,
    append_images=images[1:]
)

print("PDF successfully generated!")

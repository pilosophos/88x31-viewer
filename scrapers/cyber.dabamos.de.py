import requests
import shutil
from bs4 import BeautifulSoup

OUTPUT_IMG_DIR = './buttons/cyber.dabamos.de/'
OUTPUT_FULLINDEX = './indices/cyber.dabamos.de.txt'

BASE_URL = 'https://cyber.dabamos.de/88x31/'
FIRST_PAGE = 'index.html'

r = requests.get(BASE_URL + FIRST_PAGE)
soup = BeautifulSoup(r.content, features='lxml')

index_pages = [link['href'] for link in soup.select('.big > a') if link['href'] != FIRST_PAGE]

full_index = []

def write_full_index_to_file():
    with open(OUTPUT_FULLINDEX, 'w') as f:
        f.write('\n'.join(full_index))

def scrape_buttons_from_index(soup):
    img_elements = soup.select('img[width="88"][height="31"]')
    for img in img_elements:
        name = img['src']
        with open(OUTPUT_IMG_DIR + name, 'wb') as button_file:
            response = requests.get(BASE_URL + name, stream=True)
            shutil.copyfileobj(response.raw, button_file)
            full_index.append(name)
    write_full_index_to_file()

scrape_buttons_from_index(soup)

for index in index_pages:
    r = requests.get(BASE_URL + index)
    soup = BeautifulSoup(r.content, features='lxml')
    scrape_buttons_from_index(soup)
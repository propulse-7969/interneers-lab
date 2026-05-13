import requests
import time


API_URL = "http://localhost:8001/api/product/"


products = [
  {
    "name": "iPad Air M2",
    "description": "Portable tablet for productivity",
    "category": "6a0363c91efdf09d55a0872d",
    "price": 68999,
    "brand": "Apple",
    "quantity": 6
  },
  {
    "name": "Galaxy Tab S9",
    "description": "Premium Android tablet",
    "category": "6a0363c91efdf09d55a0872d",
    "price": 64999,
    "brand": "Samsung",
    "quantity": 9
  },
  {
    "name": "Kindle Paperwhite",
    "description": "E-ink reading device",
    "category": "6a0363c91efdf09d55a0872d",
    "price": 14999,
    "brand": "Amazon",
    "quantity": 35
  },
  {
    "name": "Apple Watch Series 10",
    "description": "Smart fitness watch",
    "category": "6a0363c91efdf09d55a0872d",
    "price": 42999,
    "brand": "Apple",
    "quantity": 3
  },
  {
    "name": "Nothing Ear 3",
    "description": "Wireless transparent earbuds",
    "category": "6a0363c91efdf09d55a0872d",
    "price": 9999,
    "brand": "Nothing",
    "quantity": 95
  },
  {
    "name": "Dell XPS 15",
    "description": "Professional performance laptop",
    "category": "6a0363c91efdf09d55a0872d",
    "price": 154999,
    "brand": "Dell",
    "quantity": 4
  },
  {
    "name": "Logitech MX Master 3S",
    "description": "Premium productivity mouse",
    "category": "6a0363c91efdf09d55a0872d",
    "price": 8999,
    "brand": "Logitech",
    "quantity": 48
  },
  {
    "name": "Samsung SSD 1TB",
    "description": "External solid state drive",
    "category": "6a0363c91efdf09d55a0872d",
    "price": 10999,
    "brand": "Samsung",
    "quantity": 120
  },

  {
    "name": "The Psychology of Money",
    "description": "Financial wisdom and investing",
    "category": "6a0363df1efdf09d55a0872e",
    "price": 549,
    "brand": "Jaico",
    "quantity": 70
  },
  {
    "name": "Zero to One",
    "description": "Startup mindset and innovation",
    "category": "6a0363df1efdf09d55a0872e",
    "price": 399,
    "brand": "Currency",
    "quantity": 12
  },
  {
    "name": "Think and Grow Rich",
    "description": "Classic success literature",
    "category": "6a0363df1efdf09d55a0872e",
    "price": 299,
    "brand": "Fingerprint",
    "quantity": 150
  },

  {
    "name": "Cargo Pants",
    "description": "Utility casual wear",
    "category": "6a0363e81efdf09d55a0872f",
    "price": 1899,
    "brand": "H&M",
    "quantity": 42
  },
  {
    "name": "Oversized Hoodie",
    "description": "Winter streetwear hoodie",
    "category": "6a0363e81efdf09d55a0872f",
    "price": 2299,
    "brand": "Zara",
    "quantity": 15
  },
  {
    "name": "Track Pants",
    "description": "Sports and gym wear",
    "category": "6a0363e81efdf09d55a0872f",
    "price": 1399,
    "brand": "Adidas",
    "quantity": 88
  },
  {
    "name": "Polo T-Shirt",
    "description": "Semi-formal cotton polo",
    "category": "6a0363e81efdf09d55a0872f",
    "price": 1299,
    "brand": "US Polo",
    "quantity": 7
  },
  {
    "name": "Leather Belt",
    "description": "Formal leather accessory",
    "category": "6a0363e81efdf09d55a0872f",
    "price": 999,
    "brand": "Allen Solly",
    "quantity": 55
  },
  {
    "name": "Winter Beanie",
    "description": "Woolen winter cap",
    "category": "6a0363e81efdf09d55a0872f",
    "price": 499,
    "brand": "Puma",
    "quantity": 110
  },

  {
    "name": "Induction Cooktop",
    "description": "Portable induction stove",
    "category": "6a03640a1efdf09d55a08730",
    "price": 3499,
    "brand": "Philips",
    "quantity": 2
  },
  {
    "name": "Rice Cooker",
    "description": "Automatic electric rice cooker",
    "category": "6a03640a1efdf09d55a08730",
    "price": 4299,
    "brand": "Panasonic",
    "quantity": 37
  },

  {
    "name": "Basketball",
    "description": "Indoor outdoor basketball",
    "category": "6a0364161efdf09d55a08731",
    "price": 1899,
    "brand": "Spalding",
    "quantity": 32
  },
  {
    "name": "Skipping Rope",
    "description": "Adjustable cardio rope",
    "category": "6a0364161efdf09d55a08731",
    "price": 499,
    "brand": "Decathlon",
    "quantity": 140
  },
  {
    "name": "Resistance Bands",
    "description": "Strength training bands",
    "category": "6a0364161efdf09d55a08731",
    "price": 899,
    "brand": "Boldfit",
    "quantity": 58
  },
  {
    "name": "Tennis Balls Pack",
    "description": "Professional tennis balls",
    "category": "6a0364161efdf09d55a08731",
    "price": 799,
    "brand": "Wilson",
    "quantity": 11
  },
  {
    "name": "Cycling Helmet",
    "description": "Safety helmet for cycling",
    "category": "6a0364161efdf09d55a08731",
    "price": 2499,
    "brand": "Btwin",
    "quantity": 4
  },
  {
    "name": "Foam Roller",
    "description": "Recovery and mobility tool",
    "category": "6a0364161efdf09d55a08731",
    "price": 1199,
    "brand": "Decathlon",
    "quantity": 85
  }
]


for index, product in enumerate(products, start=1):

    try:
        response = requests.post(
            API_URL,
            json=product
        )

        print(
            f"{index}: "
            f"{response.status_code} "
            f"{response.json()}"
        )

    except Exception as e:
        print(
            f"{index}: Failed -> {e}"
        )

    time.sleep(0.015)
import requests
import time


API_URL = "http://localhost:8001/api/product/"


products = [
  {
    "name": "iPhone 15",
    "description": "Apple smartphone with A16 chip",
    "category": "6a0363c91efdf09d55a0872d",
    "price": 79999,
    "brand": "Apple",
    "quantity": 12
  },
  {
    "name": "Galaxy S24",
    "description": "Flagship Android smartphone",
    "category": "6a0363c91efdf09d55a0872d",
    "price": 74999,
    "brand": "Samsung",
    "quantity": 15
  },
  {
    "name": "AirPods Pro",
    "description": "Wireless noise cancelling earbuds",
    "category": "6a0363c91efdf09d55a0872d",
    "price": 24999,
    "brand": "Apple",
    "quantity": 20
  },
  {
    "name": "WH-1000XM5",
    "description": "Premium wireless headphones",
    "category": "6a0363c91efdf09d55a0872d",
    "price": 29999,
    "brand": "Sony",
    "quantity": 10
  },
  {
    "name": "MacBook Air M3",
    "description": "Lightweight performance laptop",
    "category": "6a0363c91efdf09d55a0872d",
    "price": 114999,
    "brand": "Apple",
    "quantity": 8
  },

  {
    "name": "Atomic Habits",
    "description": "Self improvement bestseller",
    "category": "6a0363df1efdf09d55a0872e",
    "price": 499,
    "brand": "Penguin",
    "quantity": 50
  },
  {
    "name": "Clean Code",
    "description": "Software engineering classic",
    "category": "6a0363df1efdf09d55a0872e",
    "price": 899,
    "brand": "Prentice Hall",
    "quantity": 30
  },
  {
    "name": "Deep Work",
    "description": "Focus and productivity book",
    "category": "6a0363df1efdf09d55a0872e",
    "price": 599,
    "brand": "Grand Central",
    "quantity": 35
  },
  {
    "name": "The Pragmatic Programmer",
    "description": "Programming best practices",
    "category": "6a0363df1efdf09d55a0872e",
    "price": 999,
    "brand": "Addison Wesley",
    "quantity": 25
  },
  {
    "name": "Rich Dad Poor Dad",
    "description": "Personal finance bestseller",
    "category": "6a0363df1efdf09d55a0872e",
    "price": 399,
    "brand": "Plata Publishing",
    "quantity": 45
  },

  {
    "name": "Slim Fit T-Shirt",
    "description": "Cotton casual t-shirt",
    "category": "6a0363e81efdf09d55a0872f",
    "price": 799,
    "brand": "Nike",
    "quantity": 60
  },
  {
    "name": "Denim Jeans",
    "description": "Regular fit denim jeans",
    "category": "6a0363e81efdf09d55a0872f",
    "price": 1999,
    "brand": "Levis",
    "quantity": 40
  },
  {
    "name": "Running Jacket",
    "description": "Lightweight sports jacket",
    "category": "6a0363e81efdf09d55a0872f",
    "price": 2499,
    "brand": "Adidas",
    "quantity": 22
  },
  {
    "name": "Sneakers",
    "description": "Comfortable casual sneakers",
    "category": "6a0363e81efdf09d55a0872f",
    "price": 3499,
    "brand": "Puma",
    "quantity": 28
  },
  {
    "name": "Formal Shirt",
    "description": "Office wear cotton shirt",
    "category": "6a0363e81efdf09d55a0872f",
    "price": 1599,
    "brand": "Van Heusen",
    "quantity": 32
  },

  {
    "name": "Microwave Oven",
    "description": "23L convection microwave",
    "category": "6a03640a1efdf09d55a08730",
    "price": 8999,
    "brand": "LG",
    "quantity": 8
  },
  {
    "name": "Air Fryer",
    "description": "Oil free cooking appliance",
    "category": "6a03640a1efdf09d55a08730",
    "price": 6999,
    "brand": "Philips",
    "quantity": 14
  },
  {
    "name": "Vacuum Cleaner",
    "description": "High suction vacuum cleaner",
    "category": "6a03640a1efdf09d55a08730",
    "price": 11999,
    "brand": "Dyson",
    "quantity": 5
  },
  {
    "name": "Mixer Grinder",
    "description": "750W kitchen mixer",
    "category": "6a03640a1efdf09d55a08730",
    "price": 3999,
    "brand": "Prestige",
    "quantity": 18
  },
  {
    "name": "Electric Kettle",
    "description": "1.5L fast boiling kettle",
    "category": "6a03640a1efdf09d55a08730",
    "price": 1999,
    "brand": "Havells",
    "quantity": 24
  },

  {
    "name": "Cricket Bat",
    "description": "English willow cricket bat",
    "category": "6a0364161efdf09d55a08731",
    "price": 4999,
    "brand": "SG",
    "quantity": 16
  },
  {
    "name": "Football",
    "description": "Professional match football",
    "category": "6a0364161efdf09d55a08731",
    "price": 1499,
    "brand": "Nike",
    "quantity": 25
  },
  {
    "name": "Badminton Racket",
    "description": "Lightweight graphite racket",
    "category": "6a0364161efdf09d55a08731",
    "price": 2999,
    "brand": "Yonex",
    "quantity": 20
  },
  {
    "name": "Yoga Mat",
    "description": "Anti-slip exercise mat",
    "category": "6a0364161efdf09d55a08731",
    "price": 999,
    "brand": "Decathlon",
    "quantity": 45
  },
  {
    "name": "Dumbbell Set",
    "description": "Adjustable home workout dumbbells",
    "category": "6a0364161efdf09d55a08731",
    "price": 5999,
    "brand": "Decathlon",
    "quantity": 12
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
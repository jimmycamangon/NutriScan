import { useState, useEffect, useRef } from "react";

// ── constants ─────────────────────────────────────────────────────────────────
const GOAL_CAL = 2000;
const PRICE_INPUT = 1.0 / 1_000_000;
const PRICE_OUTPUT = 5.0 / 1_000_000;
const BUDGET = 5.0;
const DAILY_LIMIT = 10_000;

// ── food database (per 100g) ──────────────────────────────────────────────────
const BUILT_IN_FOODS = [
  {
    id: "f1",
    name: "Sinangag (Garlic Fried Rice)",
    cal: 181,
    protein: 3.5,
    carbs: 34,
    fat: 3.5,
    fiber: 0.5,
    category: "Filipino",
  },
  {
    id: "f2",
    name: "Chicken Adobo",
    cal: 215,
    protein: 22,
    carbs: 2,
    fat: 13,
    fiber: 0,
    category: "Filipino",
  },
  {
    id: "f3",
    name: "Pork Adobo",
    cal: 280,
    protein: 20,
    carbs: 2,
    fat: 21,
    fiber: 0,
    category: "Filipino",
  },
  {
    id: "f4",
    name: "Sinigang na Baboy",
    cal: 95,
    protein: 8,
    carbs: 6,
    fat: 4,
    fiber: 1.5,
    category: "Filipino",
  },
  {
    id: "f5",
    name: "Sinigang na Hipon",
    cal: 70,
    protein: 9,
    carbs: 5,
    fat: 1.5,
    fiber: 1.5,
    category: "Filipino",
  },
  {
    id: "f6",
    name: "Kare-Kare",
    cal: 180,
    protein: 12,
    carbs: 8,
    fat: 11,
    fiber: 2,
    category: "Filipino",
  },
  {
    id: "f7",
    name: "Lechon (Roast Pork)",
    cal: 307,
    protein: 21,
    carbs: 0,
    fat: 25,
    fiber: 0,
    category: "Filipino",
  },
  {
    id: "f8",
    name: "Tinolang Manok",
    cal: 85,
    protein: 10,
    carbs: 4,
    fat: 3,
    fiber: 1,
    category: "Filipino",
  },
  {
    id: "f9",
    name: "Pancit Canton",
    cal: 160,
    protein: 6,
    carbs: 28,
    fat: 3,
    fiber: 1,
    category: "Filipino",
  },
  {
    id: "f10",
    name: "Pancit Bihon",
    cal: 145,
    protein: 5,
    carbs: 27,
    fat: 2,
    fiber: 0.5,
    category: "Filipino",
  },
  {
    id: "f11",
    name: "Lumpiang Prito",
    cal: 220,
    protein: 8,
    carbs: 18,
    fat: 13,
    fiber: 1,
    category: "Filipino",
  },
  {
    id: "f12",
    name: "Lumpia Shanghai",
    cal: 240,
    protein: 10,
    carbs: 16,
    fat: 15,
    fiber: 0.5,
    category: "Filipino",
  },
  {
    id: "f13",
    name: "Menudo",
    cal: 175,
    protein: 12,
    carbs: 9,
    fat: 10,
    fiber: 1.5,
    category: "Filipino",
  },
  {
    id: "f14",
    name: "Caldereta",
    cal: 195,
    protein: 14,
    carbs: 8,
    fat: 12,
    fiber: 1.5,
    category: "Filipino",
  },
  {
    id: "f15",
    name: "Bistek Tagalog",
    cal: 210,
    protein: 18,
    carbs: 5,
    fat: 13,
    fiber: 0.5,
    category: "Filipino",
  },
  {
    id: "f16",
    name: "Giniling na Baboy",
    cal: 195,
    protein: 14,
    carbs: 6,
    fat: 13,
    fiber: 1,
    category: "Filipino",
  },
  {
    id: "f17",
    name: "Nilaga",
    cal: 110,
    protein: 11,
    carbs: 5,
    fat: 5,
    fiber: 1,
    category: "Filipino",
  },
  {
    id: "f18",
    name: "Pinakbet",
    cal: 95,
    protein: 5,
    carbs: 8,
    fat: 5,
    fiber: 3,
    category: "Filipino",
  },
  {
    id: "f19",
    name: "Dinuguan",
    cal: 200,
    protein: 14,
    carbs: 3,
    fat: 15,
    fiber: 0,
    category: "Filipino",
  },
  {
    id: "f20",
    name: "Tortang Talong",
    cal: 185,
    protein: 12,
    carbs: 4,
    fat: 13,
    fiber: 0.5,
    category: "Filipino",
  },
  {
    id: "f21",
    name: "Longganisa (Sweet)",
    cal: 290,
    protein: 14,
    carbs: 12,
    fat: 21,
    fiber: 0,
    category: "Filipino",
  },
  {
    id: "f22",
    name: "Tocino",
    cal: 275,
    protein: 16,
    carbs: 14,
    fat: 17,
    fiber: 0,
    category: "Filipino",
  },
  {
    id: "f23",
    name: "Daing na Bangus",
    cal: 210,
    protein: 22,
    carbs: 0,
    fat: 13,
    fiber: 0,
    category: "Filipino",
  },
  {
    id: "f24",
    name: "Pork Sisig",
    cal: 320,
    protein: 20,
    carbs: 3,
    fat: 26,
    fiber: 0.5,
    category: "Filipino",
  },
  {
    id: "f25",
    name: "Fried Bangus",
    cal: 195,
    protein: 21,
    carbs: 0,
    fat: 12,
    fiber: 0,
    category: "Filipino",
  },
  {
    id: "f26",
    name: "Bulalo",
    cal: 130,
    protein: 12,
    carbs: 4,
    fat: 7,
    fiber: 0.5,
    category: "Filipino",
  },
  {
    id: "f27",
    name: "Arroz Caldo",
    cal: 110,
    protein: 6,
    carbs: 18,
    fat: 2,
    fiber: 0.5,
    category: "Filipino",
  },
  {
    id: "f28",
    name: "Goto",
    cal: 100,
    protein: 7,
    carbs: 14,
    fat: 2,
    fiber: 0.5,
    category: "Filipino",
  },
  {
    id: "f29",
    name: "Champorado",
    cal: 165,
    protein: 3,
    carbs: 33,
    fat: 3,
    fiber: 1,
    category: "Filipino",
  },
  {
    id: "f30",
    name: "Leche Flan",
    cal: 230,
    protein: 6,
    carbs: 35,
    fat: 8,
    fiber: 0,
    category: "Filipino",
  },
  {
    id: "f31",
    name: "Halo-Halo",
    cal: 285,
    protein: 5,
    carbs: 54,
    fat: 7,
    fiber: 2,
    category: "Filipino",
  },
  {
    id: "f32",
    name: "Bibingka",
    cal: 270,
    protein: 5,
    carbs: 42,
    fat: 10,
    fiber: 1,
    category: "Filipino",
  },
  {
    id: "f33",
    name: "Puto",
    cal: 190,
    protein: 4,
    carbs: 38,
    fat: 2,
    fiber: 0.5,
    category: "Filipino",
  },
  {
    id: "f34",
    name: "Saging na Saba (Boiled)",
    cal: 110,
    protein: 1,
    carbs: 28,
    fat: 0.3,
    fiber: 2.5,
    category: "Filipino",
  },
  {
    id: "f35",
    name: "Fried Tilapia",
    cal: 180,
    protein: 22,
    carbs: 4,
    fat: 8,
    fiber: 0,
    category: "Filipino",
  },
  {
    id: "f36",
    name: "Lechon Kawali",
    cal: 395,
    protein: 19,
    carbs: 3,
    fat: 35,
    fiber: 0,
    category: "Filipino",
  },
  {
    id: "f37",
    name: "Crispy Pata",
    cal: 420,
    protein: 22,
    carbs: 4,
    fat: 37,
    fiber: 0,
    category: "Filipino",
  },
  {
    id: "f38",
    name: "Laing",
    cal: 210,
    protein: 5,
    carbs: 8,
    fat: 19,
    fiber: 3,
    category: "Filipino",
  },
  {
    id: "r1",
    name: "White Rice (cooked)",
    cal: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    category: "Rice & Grains",
  },
  {
    id: "r2",
    name: "Brown Rice (cooked)",
    cal: 112,
    protein: 2.6,
    carbs: 24,
    fat: 0.9,
    fiber: 1.8,
    category: "Rice & Grains",
  },
  {
    id: "r3",
    name: "Oatmeal (cooked)",
    cal: 71,
    protein: 2.5,
    carbs: 12,
    fat: 1.5,
    fiber: 1.7,
    category: "Rice & Grains",
  },
  {
    id: "r4",
    name: "Instant Noodles (cooked)",
    cal: 138,
    protein: 3.5,
    carbs: 20,
    fat: 5,
    fiber: 0.5,
    category: "Rice & Grains",
  },
  {
    id: "r5",
    name: "Pandesal",
    cal: 290,
    protein: 8,
    carbs: 52,
    fat: 5,
    fiber: 2,
    category: "Rice & Grains",
  },
  {
    id: "r6",
    name: "White Bread",
    cal: 265,
    protein: 9,
    carbs: 49,
    fat: 3.2,
    fiber: 2.7,
    category: "Rice & Grains",
  },
  {
    id: "e1",
    name: "Boiled Egg",
    cal: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    category: "Eggs & Dairy",
  },
  {
    id: "e2",
    name: "Fried Egg",
    cal: 196,
    protein: 13,
    carbs: 0.8,
    fat: 15,
    fiber: 0,
    category: "Eggs & Dairy",
  },
  {
    id: "e3",
    name: "Scrambled Egg",
    cal: 149,
    protein: 10,
    carbs: 1.6,
    fat: 11,
    fiber: 0,
    category: "Eggs & Dairy",
  },
  {
    id: "e4",
    name: "Salted Egg (Itlog na Maalat)",
    cal: 185,
    protein: 13,
    carbs: 1,
    fat: 14,
    fiber: 0,
    category: "Eggs & Dairy",
  },
  {
    id: "e5",
    name: "Fresh Milk",
    cal: 61,
    protein: 3.2,
    carbs: 4.8,
    fat: 3.3,
    fiber: 0,
    category: "Eggs & Dairy",
  },
  {
    id: "e6",
    name: "Evaporated Milk",
    cal: 134,
    protein: 6.8,
    carbs: 10,
    fat: 7.6,
    fiber: 0,
    category: "Eggs & Dairy",
  },
  {
    id: "e7",
    name: "Condensed Milk",
    cal: 321,
    protein: 7.9,
    carbs: 55,
    fat: 8.7,
    fiber: 0,
    category: "Eggs & Dairy",
  },
  {
    id: "e8",
    name: "Quick Melt Cheese",
    cal: 330,
    protein: 20,
    carbs: 6,
    fat: 26,
    fiber: 0,
    category: "Eggs & Dairy",
  },
  {
    id: "e9",
    name: "Yogurt (Plain)",
    cal: 59,
    protein: 3.5,
    carbs: 5,
    fat: 3.3,
    fiber: 0,
    category: "Eggs & Dairy",
  },
  {
    id: "c1",
    name: "Sardines in Tomato Sauce",
    cal: 165,
    protein: 18,
    carbs: 4,
    fat: 9,
    fiber: 0.5,
    category: "Canned Foods",
  },
  {
    id: "c2",
    name: "Canned Tuna in Water",
    cal: 116,
    protein: 26,
    carbs: 0,
    fat: 1,
    fiber: 0,
    category: "Canned Foods",
  },
  {
    id: "c3",
    name: "Canned Tuna in Oil",
    cal: 198,
    protein: 24,
    carbs: 0,
    fat: 11,
    fiber: 0,
    category: "Canned Foods",
  },
  {
    id: "c4",
    name: "Corned Beef",
    cal: 185,
    protein: 15,
    carbs: 2,
    fat: 13,
    fiber: 0,
    category: "Canned Foods",
  },
  {
    id: "c5",
    name: "Corned Beef Hash",
    cal: 175,
    protein: 12,
    carbs: 10,
    fat: 11,
    fiber: 0.5,
    category: "Canned Foods",
  },
  {
    id: "c6",
    name: "SPAM Luncheon Meat",
    cal: 310,
    protein: 13,
    carbs: 3,
    fat: 27,
    fiber: 0,
    category: "Canned Foods",
  },
  {
    id: "c7",
    name: "Maling Pork Luncheon",
    cal: 295,
    protein: 12,
    carbs: 4,
    fat: 26,
    fiber: 0,
    category: "Canned Foods",
  },
  {
    id: "c8",
    name: "Liver Spread",
    cal: 210,
    protein: 11,
    carbs: 7,
    fat: 16,
    fiber: 0,
    category: "Canned Foods",
  },
  {
    id: "c9",
    name: "Pork & Beans",
    cal: 130,
    protein: 6,
    carbs: 22,
    fat: 2.5,
    fiber: 5,
    category: "Canned Foods",
  },
  {
    id: "c10",
    name: "Canned Mushroom",
    cal: 25,
    protein: 2,
    carbs: 4,
    fat: 0.3,
    fiber: 1.5,
    category: "Canned Foods",
  },
  {
    id: "c11",
    name: "Canned Green Peas",
    cal: 69,
    protein: 5,
    carbs: 12,
    fat: 0.4,
    fiber: 4,
    category: "Canned Foods",
  },
  {
    id: "c12",
    name: "Canned Corn",
    cal: 86,
    protein: 3.2,
    carbs: 19,
    fat: 1.2,
    fiber: 2,
    category: "Canned Foods",
  },
  {
    id: "c13",
    name: "Canned Mackerel",
    cal: 158,
    protein: 19,
    carbs: 0,
    fat: 9,
    fiber: 0,
    category: "Canned Foods",
  },
  {
    id: "c14",
    name: "Coconut Milk (Canned)",
    cal: 197,
    protein: 2,
    carbs: 6,
    fat: 21,
    fiber: 0,
    category: "Canned Foods",
  },
  {
    id: "m1",
    name: "Chicken Breast (Grilled)",
    cal: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    category: "Meat & Seafood",
  },
  {
    id: "m2",
    name: "Chicken Thigh (Fried)",
    cal: 229,
    protein: 25,
    carbs: 4,
    fat: 13,
    fiber: 0,
    category: "Meat & Seafood",
  },
  {
    id: "m3",
    name: "Ground Beef (Cooked)",
    cal: 254,
    protein: 26,
    carbs: 0,
    fat: 17,
    fiber: 0,
    category: "Meat & Seafood",
  },
  {
    id: "m4",
    name: "Shrimp (Boiled)",
    cal: 99,
    protein: 21,
    carbs: 0.3,
    fat: 1.1,
    fiber: 0,
    category: "Meat & Seafood",
  },
  {
    id: "m5",
    name: "Squid (Adobo Style)",
    cal: 145,
    protein: 16,
    carbs: 4,
    fat: 7,
    fiber: 0,
    category: "Meat & Seafood",
  },
  {
    id: "m6",
    name: "Bangus Fillet (Grilled)",
    cal: 148,
    protein: 20,
    carbs: 0,
    fat: 7,
    fiber: 0,
    category: "Meat & Seafood",
  },
  {
    id: "m7",
    name: "Tilapia (Steamed)",
    cal: 96,
    protein: 20,
    carbs: 0,
    fat: 2,
    fiber: 0,
    category: "Meat & Seafood",
  },
  {
    id: "m8",
    name: "Beef (Stewed)",
    cal: 218,
    protein: 26,
    carbs: 0,
    fat: 12,
    fiber: 0,
    category: "Meat & Seafood",
  },
  {
    id: "m9",
    name: "Hot Dog",
    cal: 290,
    protein: 11,
    carbs: 4,
    fat: 26,
    fiber: 0,
    category: "Meat & Seafood",
  },
  {
    id: "m10",
    name: "Pork Belly",
    cal: 518,
    protein: 9,
    carbs: 0,
    fat: 53,
    fiber: 0,
    category: "Meat & Seafood",
  },
  {
    id: "v1",
    name: "Kangkong (Cooked)",
    cal: 19,
    protein: 2.6,
    carbs: 2.5,
    fat: 0.3,
    fiber: 2,
    category: "Vegetables",
  },
  {
    id: "v2",
    name: "Sitaw (String Beans)",
    cal: 35,
    protein: 2,
    carbs: 7,
    fat: 0.4,
    fiber: 2.7,
    category: "Vegetables",
  },
  {
    id: "v3",
    name: "Ampalaya (Bitter Gourd)",
    cal: 17,
    protein: 1,
    carbs: 3.7,
    fat: 0.2,
    fiber: 2.8,
    category: "Vegetables",
  },
  {
    id: "v4",
    name: "Malunggay (Moringa)",
    cal: 64,
    protein: 9,
    carbs: 8,
    fat: 1.4,
    fiber: 2,
    category: "Vegetables",
  },
  {
    id: "v5",
    name: "Pechay (Bok Choy)",
    cal: 13,
    protein: 1.5,
    carbs: 2.2,
    fat: 0.2,
    fiber: 1,
    category: "Vegetables",
  },
  {
    id: "v6",
    name: "Camote (Sweet Potato)",
    cal: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    fiber: 3,
    category: "Vegetables",
  },
  {
    id: "v7",
    name: "Gabi (Taro)",
    cal: 112,
    protein: 1.5,
    carbs: 26,
    fat: 0.2,
    fiber: 4.1,
    category: "Vegetables",
  },
  {
    id: "v8",
    name: "Tomato",
    cal: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    fiber: 1.2,
    category: "Vegetables",
  },
  {
    id: "v9",
    name: "Onion",
    cal: 40,
    protein: 1.1,
    carbs: 9,
    fat: 0.1,
    fiber: 1.7,
    category: "Vegetables",
  },
  {
    id: "v10",
    name: "Potato (Boiled)",
    cal: 87,
    protein: 1.9,
    carbs: 20,
    fat: 0.1,
    fiber: 1.8,
    category: "Vegetables",
  },
  {
    id: "v11",
    name: "Carrot",
    cal: 41,
    protein: 0.9,
    carbs: 10,
    fat: 0.2,
    fiber: 2.8,
    category: "Vegetables",
  },
  {
    id: "v12",
    name: "Cabbage (Cooked)",
    cal: 23,
    protein: 1.3,
    carbs: 5.2,
    fat: 0.1,
    fiber: 2.3,
    category: "Vegetables",
  },
  {
    id: "fr1",
    name: "Banana (Lakatan)",
    cal: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    fiber: 2.6,
    category: "Fruits",
  },
  {
    id: "fr2",
    name: "Ripe Mango",
    cal: 60,
    protein: 0.8,
    carbs: 15,
    fat: 0.4,
    fiber: 1.6,
    category: "Fruits",
  },
  {
    id: "fr3",
    name: "Papaya (Ripe)",
    cal: 43,
    protein: 0.5,
    carbs: 11,
    fat: 0.3,
    fiber: 1.7,
    category: "Fruits",
  },
  {
    id: "fr4",
    name: "Pineapple",
    cal: 50,
    protein: 0.5,
    carbs: 13,
    fat: 0.1,
    fiber: 1.4,
    category: "Fruits",
  },
  {
    id: "fr5",
    name: "Watermelon",
    cal: 30,
    protein: 0.6,
    carbs: 8,
    fat: 0.2,
    fiber: 0.4,
    category: "Fruits",
  },
  {
    id: "fr6",
    name: "Apple",
    cal: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4,
    category: "Fruits",
  },
  {
    id: "fr7",
    name: "Orange",
    cal: 47,
    protein: 0.9,
    carbs: 12,
    fat: 0.1,
    fiber: 2.4,
    category: "Fruits",
  },
  {
    id: "ff1",
    name: "Jollibee Yumburger",
    cal: 350,
    protein: 14,
    carbs: 38,
    fat: 15,
    fiber: 1,
    category: "Fast Food & Snacks",
  },
  {
    id: "ff2",
    name: "Jollibee Chickenjoy (1 pc)",
    cal: 410,
    protein: 28,
    carbs: 18,
    fat: 25,
    fiber: 0.5,
    category: "Fast Food & Snacks",
  },
  {
    id: "ff3",
    name: "McDo Big Mac",
    cal: 550,
    protein: 25,
    carbs: 46,
    fat: 29,
    fiber: 3,
    category: "Fast Food & Snacks",
  },
  {
    id: "ff4",
    name: "McDo Fries (Medium)",
    cal: 340,
    protein: 4,
    carbs: 44,
    fat: 16,
    fiber: 3.8,
    category: "Fast Food & Snacks",
  },
  {
    id: "ff5",
    name: "Chicharon",
    cal: 544,
    protein: 34,
    carbs: 0,
    fat: 45,
    fiber: 0,
    category: "Fast Food & Snacks",
  },
  {
    id: "ff6",
    name: "Skyflakes Crackers",
    cal: 430,
    protein: 9,
    carbs: 68,
    fat: 14,
    fiber: 2,
    category: "Fast Food & Snacks",
  },
  {
    id: "ff7",
    name: "Instant Cup Noodles",
    cal: 296,
    protein: 7,
    carbs: 40,
    fat: 12,
    fiber: 1,
    category: "Fast Food & Snacks",
  },
  {
    id: "ff8",
    name: "Piattos (Small Bag)",
    cal: 520,
    protein: 5,
    carbs: 58,
    fat: 30,
    fiber: 2,
    category: "Fast Food & Snacks",
  },
  {
    id: "b1",
    name: "Brewed Coffee (Black)",
    cal: 2,
    protein: 0.3,
    carbs: 0,
    fat: 0,
    fiber: 0,
    category: "Beverages",
  },
  {
    id: "b2",
    name: "3-in-1 Coffee (Nescafe)",
    cal: 60,
    protein: 1,
    carbs: 12,
    fat: 1.5,
    fiber: 0,
    category: "Beverages",
  },
  {
    id: "b3",
    name: "Milo (1 Sachet)",
    cal: 110,
    protein: 2,
    carbs: 23,
    fat: 1,
    fiber: 1,
    category: "Beverages",
  },
  {
    id: "b4",
    name: "Softdrinks (1 Can)",
    cal: 140,
    protein: 0,
    carbs: 39,
    fat: 0,
    fiber: 0,
    category: "Beverages",
  },
  {
    id: "b5",
    name: "Juice Drink (250ml)",
    cal: 110,
    protein: 0.5,
    carbs: 28,
    fat: 0,
    fiber: 0.5,
    category: "Beverages",
  },
  {
    id: "b6",
    name: "Coconut Water (1 Cup)",
    cal: 46,
    protein: 1.7,
    carbs: 9,
    fat: 0.5,
    fiber: 2.6,
    category: "Beverages",
  },
];

const PORTIONS = [
  { label: "100g", grams: 100 },
  { label: "50g", grams: 50 },
  { label: "150g", grams: 150 },
  { label: "200g", grams: 200 },
  { label: "250g", grams: 250 },
  { label: "1 cup", grams: 240 },
  { label: "½ cup", grams: 120 },
  { label: "1 tbsp", grams: 15 },
  { label: "1 pc", grams: 100 },
];

// ── storage ───────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().slice(0, 10);
const todayKey = () => "nutriscan_log_" + todayStr();
const loadLog = () => JSON.parse(localStorage.getItem(todayKey()) || "[]");
const saveLog = (l) => localStorage.setItem(todayKey(), JSON.stringify(l));
const loadUsage = () =>
  JSON.parse(
    localStorage.getItem("nutriscan_usage") ||
      '{"totalInput":0,"totalOutput":0,"days":{}}',
  );
const saveUsage = (u) =>
  localStorage.setItem("nutriscan_usage", JSON.stringify(u));
const loadCustom = () =>
  JSON.parse(localStorage.getItem("nutriscan_custom") || "[]");
const saveCustom = (f) =>
  localStorage.setItem("nutriscan_custom", JSON.stringify(f));

function recordUsage(i, o) {
  const u = loadUsage(),
    d = todayStr();
  u.totalInput += i;
  u.totalOutput += o;
  if (!u.days[d]) u.days[d] = { input: 0, output: 0 };
  u.days[d].input += i;
  u.days[d].output += o;
  saveUsage(u);
  return u;
}
const calcCost = (i, o) => i * PRICE_INPUT + o * PRICE_OUTPUT;
const fmtDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
const scaleFood = (f, g) => ({
  calories: Math.round(f.cal * (g / 100)),
  protein: Math.round(f.protein * (g / 100) * 10) / 10,
  carbs: Math.round(f.carbs * (g / 100) * 10) / 10,
  fat: Math.round(f.fat * (g / 100) * 10) / 10,
  fiber: Math.round(f.fiber * (g / 100) * 10) / 10,
});

// ── themes ────────────────────────────────────────────────────────────────────
const T = {
  dark: {
    bg: "#050505",
    sur: "#0d0d0d",
    sur2: "#111",
    brd: "#161616",
    brd2: "#1e1e1e",
    txt: "#e0e0e0",
    muted: "#888",
    dim: "#444",
    faint: "#2a2a2a",
    acc: "#a3e635",
    accTxt: "#050505",
    accBg: "#0e1a02",
    inp: "#111",
    pbg: "#0d1f35",
    cbg: "#2a1200",
    fbg: "#280d1a",
    fibg: "#0e1a02",
    ph: "#181818",
    hist: "#1e3a5f",
    tog: "#111",
    togBrd: "#1e1e1e",
    err: "#120404",
    errBrd: "#2a0808",
  },
  light: {
    bg: "#f5f5f0",
    sur: "#ffffff",
    sur2: "#f0f0ea",
    brd: "#e8e8e0",
    brd2: "#d8d8d0",
    txt: "#1a1a1a",
    muted: "#666",
    dim: "#999",
    faint: "#bbb",
    acc: "#4d7c0f",
    accTxt: "#fff",
    accBg: "#f0fae8",
    inp: "#f8f8f4",
    pbg: "#eff6ff",
    cbg: "#fff7ed",
    fbg: "#fdf2f8",
    fibg: "#f7fee7",
    ph: "#f0f0ea",
    hist: "#bfdbfe",
    tog: "#f0f0ea",
    togBrd: "#e0e0d8",
    err: "#fef2f2",
    errBrd: "#fecaca",
  },
};

// ── CSS generator ─────────────────────────────────────────────────────────────
function makeCSS(t) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:${t.bg};transition:background .3s}
    .app{min-height:100vh;font-family:'Outfit',sans-serif;color:${t.txt};background:${t.bg};transition:background .25s,color .25s;padding-bottom:72px}
    .page{max-width:440px;margin:0 auto;padding:28px 18px 20px}
    .tab-bar{position:fixed;bottom:0;left:0;right:0;background:${t.sur};border-top:1px solid ${t.brd};display:flex;z-index:50}
    .tab-btn{flex:1;padding:10px 4px 14px;border:none;background:transparent;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;color:${t.dim};font-family:'Outfit',sans-serif;transition:color .2s}
    .tab-btn.on{color:${t.acc}}
    .tab-icon{font-size:20px;line-height:1;position:relative}
    .tab-badge{position:absolute;top:-4px;right:-6px;background:${t.acc};color:${t.accTxt};border-radius:50%;width:16px;height:16px;font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center}
    .tab-lbl{font-size:10px;font-weight:600;letter-spacing:.04em}
    .hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;gap:12px}
    .logo{font-size:26px;font-weight:800;letter-spacing:-1.5px;line-height:1;color:${t.txt}}
    .logo em{color:${t.acc};font-style:normal}
    .hdr-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
    .hdr-btns{display:flex;gap:8px}
    .icon-btn{background:${t.tog};border:1px solid ${t.togBrd};border-radius:10px;padding:8px 11px;font-size:14px;cursor:pointer;color:${t.muted};transition:all .2s;line-height:1}
    .icon-btn:hover{color:${t.txt};border-color:${t.brd2}}
    .icon-btn.on{border-color:${t.acc};color:${t.acc};background:${t.accBg}}
    .date-txt{font-size:12px;color:${t.muted};text-align:right}
    .date-sub{font-size:10px;color:${t.dim};margin-top:1px;letter-spacing:.06em;text-transform:uppercase;text-align:right}
    .mode-bar{display:flex;background:${t.sur2};border:1px solid ${t.brd};border-radius:14px;padding:4px;margin-bottom:16px;gap:4px}
    .mode-btn{flex:1;padding:9px;border:none;border-radius:10px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;background:transparent;color:${t.muted}}
    .mode-btn.on{background:${t.sur};color:${t.txt}}
    .mode-btn.ai-on{color:${t.acc}}
    .key-banner{background:${t.err};border:1px solid ${t.errBrd};border-left:3px solid #fb923c;border-radius:14px;padding:16px;margin-bottom:16px}
    .key-lbl{font-size:13px;color:#fb923c;font-weight:600;margin-bottom:10px}
    .key-row{display:flex;gap:8px}
    .key-inp{flex:1;background:${t.inp};border:1px solid ${t.brd2};border-radius:10px;padding:10px 14px;font-size:13px;color:${t.txt};outline:none;font-family:'Outfit',sans-serif}
    .key-inp:focus{border-color:${t.acc}}
    .key-tog{background:${t.inp};border:1px solid ${t.brd2};border-radius:10px;padding:10px 12px;color:${t.muted};cursor:pointer;font-size:14px}
    .key-save{background:${t.acc};color:${t.accTxt};border:none;border-radius:10px;padding:10px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif}
    .usage-panel{background:${t.sur};border:1px solid ${t.brd};border-radius:20px;padding:18px;margin-bottom:14px}
    .usage-ttl{font-size:11px;font-weight:700;letter-spacing:.1em;color:${t.dim};text-transform:uppercase;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center}
    .rst-btn{font-size:11px;color:${t.dim};background:none;border:1px solid ${t.brd2};border-radius:6px;padding:3px 8px;cursor:pointer;font-family:'Outfit',sans-serif}
    .rst-btn:hover{color:#f87171;border-color:#f87171}
    .bar-row{margin-bottom:10px}
    .bar-top{display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px}
    .bar-lbl{color:${t.muted};font-weight:500}
    .bar-trk{height:6px;background:${t.sur2};border-radius:3px;overflow:hidden}
    .bar-fill{height:100%;border-radius:3px;transition:width .6s ease}
    .stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}
    .stat-box{background:${t.sur2};border-radius:12px;padding:10px 12px}
    .stat-val{font-size:16px;font-weight:800;letter-spacing:-.5px;line-height:1}
    .stat-lbl{font-size:10px;color:${t.dim};margin-top:3px}
    .hist-ttl{font-size:11px;font-weight:700;letter-spacing:.08em;color:${t.dim};text-transform:uppercase;margin-bottom:8px}
    .hist-row{display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid ${t.brd}}
    .hist-row:last-child{border-bottom:none}
    .hist-date{font-size:11px;color:${t.dim};min-width:72px}
    .hist-bar-w{flex:1;height:4px;background:${t.sur2};border-radius:2px;overflow:hidden}
    .hist-bar{height:100%;border-radius:2px}
    .hist-cost{font-size:11px;font-weight:700;color:${t.muted};min-width:48px;text-align:right}
    .cal-card{background:${t.sur};border:1px solid ${t.brd};border-radius:24px;padding:20px;margin-bottom:14px;display:flex;align-items:center;gap:16px}
    .ring-wrap{position:relative;width:120px;height:120px;flex-shrink:0}
    .ring-wrap svg{transform:rotate(-90deg);display:block}
    .ring-ctr{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
    .cal-num{font-size:28px;font-weight:800;letter-spacing:-2px;line-height:1;color:${t.txt}}
    .cal-unit{font-size:10px;color:${t.dim};letter-spacing:.1em;margin-top:2px}
    .cal-goal{font-size:10px;color:${t.faint};margin-top:1px}
    .macro-grid{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:7px}
    .macro-box{border-radius:12px;padding:10px 11px}
    .macro-num{font-size:18px;font-weight:700;letter-spacing:-.8px;line-height:1}
    .macro-num sup{font-size:10px;font-weight:400;vertical-align:super}
    .macro-lbl{font-size:11px;margin-top:3px;font-weight:500;opacity:.6}
    .img-preview{position:relative;border-radius:18px;overflow:hidden;margin-bottom:12px}
    .img-preview img{width:100%;max-height:200px;object-fit:cover;display:block}
    .img-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.6),transparent 55%);pointer-events:none}
    .img-tag{position:absolute;bottom:10px;left:14px;font-size:12px;color:rgba(255,255,255,.6);font-weight:500}
    .img-x{position:absolute;top:10px;right:10px;background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.1);color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center}
    .err{background:${t.err};border:1px solid ${t.errBrd};border-radius:12px;padding:11px 14px;font-size:13px;color:#f87171;margin-bottom:12px}
    .btn-primary{width:100%;background:${t.acc};color:${t.accTxt};border:none;border-radius:16px;padding:16px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:8px;transition:transform .15s,opacity .15s}
    .btn-primary:hover{opacity:.9;transform:translateY(-1px)}
    .btn-primary:active{transform:scale(.98)}
    .btn-primary:disabled{opacity:.55;cursor:not-allowed;transform:none}
    .btn-ghost{background:transparent;border:1px solid ${t.brd2};border-radius:14px;padding:13px;font-family:'Outfit',sans-serif;font-size:14px;color:${t.muted};cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:border-color .2s,color .2s;width:100%}
    .btn-ghost:hover{border-color:${t.acc};color:${t.acc}}
    .btn-sm{background:${t.sur2};border:1px solid ${t.brd2};border-radius:10px;padding:8px 14px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;color:${t.muted};cursor:pointer;transition:all .2s;white-space:nowrap}
    .btn-sm:hover{border-color:${t.acc};color:${t.acc}}
    .scan-row{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:9px}
    .btn-cam{background:${t.acc};color:${t.accTxt};border:none;border-radius:16px;padding:15px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:transform .15s,opacity .15s}
    .btn-cam:hover{opacity:.9}
    .btn-gal{background:transparent;border:1px solid ${t.brd2};border-radius:16px;padding:15px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;color:${t.muted};cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:border-color .2s,color .2s}
    .btn-gal:hover{border-color:${t.txt};color:${t.txt}}
    .manual-panel{background:${t.accBg};border:1px solid ${t.brd};border-radius:20px;padding:16px;margin-bottom:12px}
    .manual-ttl{font-size:11px;font-weight:700;letter-spacing:.1em;color:${t.acc};text-transform:uppercase;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center}
    .srch-wrap{position:relative;margin-bottom:10px}
    .srch-inp{width:100%;background:${t.sur};border:1px solid ${t.brd2};border-radius:12px;padding:12px 16px;font-size:14px;color:${t.txt};outline:none;font-family:'Outfit',sans-serif;transition:border-color .2s}
    .srch-inp:focus{border-color:${t.acc}}
    .srch-inp::placeholder{color:${t.dim}}
    .dropdown{position:absolute;top:calc(100% + 4px);left:0;right:0;background:${t.sur};border:1px solid ${t.brd2};border-radius:14px;max-height:220px;overflow-y:auto;z-index:200;box-shadow:0 8px 24px rgba(0,0,0,.15)}
    .drop-item{padding:10px 14px;cursor:pointer;transition:background .15s;border-bottom:1px solid ${t.brd}}
    .drop-item:last-child{border-bottom:none}
    .drop-item:hover{background:${t.sur2}}
    .drop-name{font-size:13px;font-weight:600;color:${t.txt}}
    .drop-meta{font-size:11px;color:${t.dim};margin-top:2px}
    .drop-cat{font-size:10px;color:${t.acc};font-weight:700;margin-top:2px;text-transform:uppercase;letter-spacing:.05em}
    .no-result{padding:18px;text-align:center;font-size:13px;color:${t.dim}}
    .sel-card{background:${t.sur};border:1px solid ${t.brd};border-radius:16px;padding:14px;margin-bottom:10px;animation:up .2s ease}
    .sel-name{font-size:15px;font-weight:700;color:${t.txt};margin-bottom:3px}
    .sel-meta{font-size:11px;color:${t.dim};margin-bottom:12px}
    .port-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px;align-items:center}
    .port-chip{background:${t.sur2};border:1px solid ${t.brd2};border-radius:8px;padding:6px 11px;font-size:12px;font-weight:600;color:${t.muted};cursor:pointer;transition:all .2s;white-space:nowrap;user-select:none}
    .port-chip.on{background:${t.accBg};border-color:${t.acc};color:${t.acc}}
    .cust-inp{background:${t.inp};border:1px solid ${t.brd2};border-radius:8px;padding:6px 10px;font-size:13px;color:${t.txt};outline:none;font-family:'Outfit',sans-serif;width:82px}
    .cust-inp:focus{border-color:${t.acc}}
    .prev-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px}
    .prev-box{background:${t.sur2};border-radius:8px;padding:8px;text-align:center}
    .prev-val{font-size:14px;font-weight:700}
    .prev-lbl{font-size:10px;color:${t.dim};margin-top:2px}
    .tray-fab{position:fixed;bottom:76px;right:18px;background:${t.acc};color:${t.accTxt};border:none;border-radius:50px;padding:12px 20px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;box-shadow:0 4px 16px rgba(0,0,0,.3);z-index:40;transition:transform .2s}
    .tray-fab:hover{transform:translateY(-2px)}
    .tray-badge{background:${t.accTxt};color:${t.acc};border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800}
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:60;display:flex;align-items:flex-end}
    .sheet{background:${t.sur};border-radius:24px 24px 0 0;width:100%;max-height:85vh;overflow-y:auto;padding:16px 18px 36px}
    .sheet-handle{width:36px;height:4px;background:${t.brd2};border-radius:2px;margin:0 auto 18px}
    .sheet-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
    .sheet-ttl{font-size:17px;font-weight:800;letter-spacing:-.5px;color:${t.txt}}
    .sheet-sub{font-size:12px;color:${t.muted};margin-top:2px}
    .sheet-x{background:${t.sur2};border:none;border-radius:50%;width:32px;height:32px;cursor:pointer;color:${t.muted};font-size:16px;display:flex;align-items:center;justify-content:center}
    .tray-item{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid ${t.brd}}
    .tray-item:last-child{border-bottom:none}
    .tray-item-name{font-size:13px;font-weight:600;color:${t.txt}}
    .tray-item-meta{font-size:11px;color:${t.dim};margin-top:2px}
    .tray-item-cal{font-size:14px;font-weight:800;color:${t.acc}}
    .tray-del{background:none;border:none;color:${t.faint};cursor:pointer;font-size:14px;padding:4px}
    .tray-del:hover{color:#f87171}
    .tray-sum{background:${t.sur2};border-radius:14px;padding:14px;margin:14px 0}
    .tray-sum-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}
    .tray-sum-box{text-align:center}
    .tray-sum-val{font-size:16px;font-weight:700}
    .tray-sum-lbl{font-size:10px;color:${t.dim};margin-top:2px}
    .sec-ttl{font-size:11px;font-weight:700;letter-spacing:.12em;color:${t.faint};text-transform:uppercase;margin-bottom:10px}
    .empty{text-align:center;padding:48px 20px}
    .empty-ico{font-size:32px;margin-bottom:12px;opacity:.25}
    .empty-txt{font-size:13px;color:${t.dim};line-height:1.6}
    .log-item{display:flex;align-items:center;gap:12px;background:${t.sur};border:1px solid ${t.brd};border-radius:18px;padding:13px;margin-bottom:7px;transition:border-color .2s;animation:up .25s ease}
    @keyframes up{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
    .log-item:hover{border-color:${t.brd2}}
    .log-thumb{width:52px;height:52px;border-radius:11px;object-fit:cover;flex-shrink:0}
    .log-ph{width:52px;height:52px;border-radius:11px;background:${t.ph};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:22px}
    .log-body{flex:1;min-width:0}
    .log-badge{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.05em;padding:2px 6px;border-radius:4px;margin-bottom:3px;text-transform:uppercase}
    .log-badge.ai{background:${t.accBg};color:${t.acc}}
    .log-badge.manual{background:${t.sur2};color:${t.muted}}
    .log-name{font-size:14px;font-weight:700;letter-spacing:-.3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px;color:${t.txt}}
    .log-port{font-size:11px;color:${t.dim};margin-bottom:3px}
    .log-macros{display:flex;gap:7px}
    .log-macros span{font-size:11px;font-weight:600}
    .log-right{display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;align-self:stretch;flex-shrink:0}
    .log-cal{font-size:17px;font-weight:800;color:${t.acc};letter-spacing:-.8px}
    .log-cal-lbl{font-size:10px;color:${t.dim}}
    .log-foot{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
    .log-time{font-size:10px;color:${t.faint}}
    .log-del{background:none;border:none;color:${t.faint};cursor:pointer;font-size:13px;padding:2px;line-height:1}
    .log-del:hover{color:#f87171}
    .foods-hdr{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px}
    .foods-ttl{font-size:20px;font-weight:800;letter-spacing:-1px;color:${t.txt}}
    .db-srch{width:100%;background:${t.sur};border:1px solid ${t.brd2};border-radius:14px;padding:12px 16px;font-size:14px;color:${t.txt};outline:none;font-family:'Outfit',sans-serif;margin-bottom:12px;transition:border-color .2s;display:block}
    .db-srch:focus{border-color:${t.acc}}
    .db-srch::placeholder{color:${t.dim}}
.cat-scroll{
  display:flex;
  flex-wrap:nowrap;
  gap:8px;

  overflow-x:auto;
  overflow-y:hidden;

  -webkit-overflow-scrolling:touch;
  scrollbar-width:none;

  width:calc(100% + 36px);
  margin-left:-18px;
  padding-left:18px;
  padding-right:18px;
  padding-bottom:8px;
  margin-bottom:14px;
}

.cat-scroll::-webkit-scrollbar{
  display:none;
}

.cat-chip{
  flex:0 0 auto;
  white-space:nowrap;

  background:${t.sur};
  border:1px solid ${t.brd2};
  border-radius:20px;
  padding:7px 16px;

  font-size:12px;
  font-weight:600;
  color:${t.muted};

  cursor:pointer;
  transition:all .2s;
  user-select:none;
}

.cat-chip.on{
  background:${t.accBg};
  border-color:${t.acc};
  color:${t.acc};
}
    .food-row{display:flex;align-items:center;background:${t.sur};border:1px solid ${t.brd};border-radius:16px;padding:12px 14px;margin-bottom:7px;cursor:pointer;transition:border-color .2s;gap:10px}
    .food-row:hover{border-color:${t.brd2}}
    .food-row-name{font-size:13px;font-weight:700;color:${t.txt};margin-bottom:3px}
    .food-row-meta{font-size:11px;color:${t.dim};margin-bottom:2px}
    .food-row-cat{font-size:10px;color:${t.acc};font-weight:700;letter-spacing:.05em;text-transform:uppercase}
    .food-row-cal{font-size:15px;font-weight:800;color:${t.acc};letter-spacing:-.5px;text-align:right}
    .food-row-cal-lbl{font-size:10px;color:${t.dim};text-align:right}
    .food-detail{background:${t.sur};border:1px solid ${t.brd};border-radius:20px;padding:18px;margin-bottom:10px;animation:up .2s ease}
    .fd-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;gap:8px}
    .fd-name{font-size:18px;font-weight:800;letter-spacing:-.5px;color:${t.txt};flex:1;min-width:0}
    .fd-cat{font-size:10px;color:${t.acc};font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px}
    .fd-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}
    .fd-box{background:${t.sur2};border-radius:12px;padding:10px;text-align:center}
    .fd-val{font-size:17px;font-weight:800;letter-spacing:-.5px;line-height:1}
    .fd-lbl{font-size:10px;color:${t.dim};margin-top:3px}
    .fd-note{font-size:11px;color:${t.dim};font-style:italic;margin-top:8px;padding-top:8px;border-top:1px solid ${t.brd}}
    .custom-strip{margin-bottom:14px;padding:12px 14px;background:${t.accBg};border:1px solid ${t.brd};border-radius:14px}
    .custom-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
    .custom-tag{display:inline-flex;align-items:center;gap:6px;background:${t.sur};border:1px solid ${t.brd2};border-radius:8px;padding:5px 10px;font-size:12px;font-weight:600;color:${t.muted}}
    .custom-x{background:none;border:none;color:${t.dim};cursor:pointer;font-size:12px;padding:0;line-height:1}
    .custom-x:hover{color:#f87171}
    .row-actions{display:flex;flex-direction:column;gap:5px;flex-shrink:0}
    .row-edit{background:${t.sur2};border:1px solid ${t.brd2};border-radius:8px;padding:5px 9px;font-size:12px;color:${t.muted};cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s;line-height:1}
    .row-edit:hover{border-color:${t.acc};color:${t.acc}}
    .row-del{background:none;border:1px solid ${t.errBrd};border-radius:8px;padding:5px 9px;font-size:12px;color:#f87171;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s;line-height:1}
    .row-del:hover{background:${t.err}}
    .form-inp{background:${t.inp};border:1px solid ${t.brd2};border-radius:8px;padding:9px 12px;font-size:13px;color:${t.txt};outline:none;font-family:'Outfit',sans-serif;width:100%}
    .form-inp:focus{border-color:${t.acc}}
    .form-lbl{font-size:11px;color:${t.dim};font-weight:600;margin-bottom:5px;display:block}
    .spinner{width:16px;height:16px;border:2px solid rgba(0,0,0,.2);border-top-color:${t.accTxt};border-radius:50%;animation:spin .65s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    @media(max-width:420px){.page{padding:20px 14px 16px}.cal-num{font-size:24px}.logo{font-size:22px}.cal-card{padding:16px;gap:12px}.ring-wrap{width:104px;height:104px}}
  `;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENTS — defined OUTSIDE main component to prevent remount on state change
// ═══════════════════════════════════════════════════════════════════════════════

function LogItem({ e, i, onDelete }) {
  return (
    <div className="log-item">
      {e.thumb ? (
        <img src={e.thumb} className="log-thumb" alt={e.name} />
      ) : (
        <div className="log-ph">{e.source === "manual" ? "🍽️" : "📷"}</div>
      )}
      <div className="log-body">
        <div className={`log-badge ${e.source === "manual" ? "manual" : "ai"}`}>
          {e.source === "manual" ? "manual" : "ai scan"}
        </div>
        <div className="log-name">{e.name}</div>
        <div className="log-port">{e.portion}</div>
        <div className="log-macros">
          <span style={{ color: "#60a5fa" }}>
            P {Math.round(e.protein || 0)}g
          </span>
          <span style={{ color: "#fb923c" }}>
            C {Math.round(e.carbs || 0)}g
          </span>
          <span style={{ color: "#f472b6" }}>F {Math.round(e.fat || 0)}g</span>
        </div>
      </div>
      <div className="log-right">
        <div>
          <div className="log-cal">{Math.round(e.calories || 0)}</div>
          <div className="log-cal-lbl">kcal</div>
        </div>
        <div className="log-foot">
          <div className="log-time">{e.time}</div>
          <button className="log-del" onClick={() => onDelete(i)}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

function CalRing({ totals, t }) {
  const pct = Math.min(totals.cal / GOAL_CAL, 1);
  const circ = 2 * Math.PI * 54;
  const offset = circ * (1 - pct);
  const color = pct > 0.9 ? "#f87171" : pct > 0.7 ? "#fb923c" : "#a3e635";
  const macros = [
    { label: "Protein", val: totals.p, color: "#60a5fa", bg: t.pbg },
    { label: "Carbs", val: totals.c, color: "#fb923c", bg: t.cbg },
    { label: "Fat", val: totals.f, color: "#f472b6", bg: t.fbg },
    { label: "Fiber", val: totals.fi, color: "#a3e635", bg: t.fibg },
  ];
  return (
    <div className="cal-card">
      <div className="ring-wrap">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={t.brd}
            strokeWidth="9"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition:
                "stroke-dashoffset .8s cubic-bezier(.4,0,.2,1),stroke .4s",
            }}
          />
        </svg>
        <div className="ring-ctr">
          <div className="cal-num">{Math.round(totals.cal)}</div>
          <div className="cal-unit">KCAL</div>
          <div className="cal-goal">/ {GOAL_CAL}</div>
        </div>
      </div>
      <div className="macro-grid">
        {macros.map((m) => (
          <div key={m.label} className="macro-box" style={{ background: m.bg }}>
            <div className="macro-num" style={{ color: m.color }}>
              {Math.round(m.val)}
              <sup>g</sup>
            </div>
            <div className="macro-lbl" style={{ color: m.color }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FoodsPage — standalone component ──────────────────────────────────────────
function FoodsPage({
  allFoods,
  customFoods,
  t,
  onDeleteCustom,
  onSaveFood,
  onUseInTray,
}) {
  const [dbSearch, setDbSearch] = useState("");
  const [dbCategory, setDbCategory] = useState("All");
  const [viewFood, setViewFood] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    cal: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    category: "Custom",
    _editId: null,
  });

  const categories = ["All", ...new Set(allFoods.map((f) => f.category))];
  const filtered = allFoods.filter((f) => {
    const catOk = dbCategory === "All" || f.category === dbCategory;
    const srchOk =
      !dbSearch || f.name.toLowerCase().includes(dbSearch.toLowerCase());
    return catOk && srchOk;
  });

  function openAdd() {
    setForm({
      name: "",
      cal: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
      category: "Custom",
      _editId: null,
    });
    setFormError(null);
    setShowForm(true);
  }
  function openEdit(f, e) {
    e.stopPropagation();
    setForm({
      name: f.name,
      cal: f.cal,
      protein: f.protein,
      carbs: f.carbs,
      fat: f.fat,
      fiber: f.fiber,
      category: f.category,
      _editId: f.id,
    });
    setFormError(null);
    setShowForm(true);
  }
  function closeForm() {
    setShowForm(false);
    setFormError(null);
    setForm({
      name: "",
      cal: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
      category: "Custom",
      _editId: null,
    });
  }
  function saveForm() {
    if (!form.name.trim()) {
      setFormError("Food name is required.");
      return;
    }
    onSaveFood(form);
    closeForm();
  }
  function handleDelete(f, e) {
    e.stopPropagation();
    if (confirm(`Delete "${f.name}"?`)) {
      onDeleteCustom(f.id);
      if (viewFood?.id === f.id) setViewFood(null);
    }
  }

  return (
    <div className="page">
      {/* header */}
      <div className="foods-hdr">
        <div>
          <div className="foods-ttl">Food Database</div>
          <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>
            {allFoods.length} foods · {customFoods.length} custom
          </div>
        </div>
        <button
          className="btn-sm"
          style={{ borderColor: t.acc, color: t.acc, background: t.accBg }}
          onClick={openAdd}
        >
          + Add Food
        </button>
      </div>

      {/* search */}
      <input
        className="db-srch"
        placeholder="🔍  Search foods..."
        value={dbSearch}
        onChange={(e) => {
          setDbSearch(e.target.value);
          setViewFood(null);
        }}
      />

      {/* category chips */}
      <div className="cat-scroll">
        {categories.map((c) => (
          <div
            key={c}
            className={`cat-chip${dbCategory === c ? " on" : ""}`}
            onClick={() => {
              setDbCategory(c);
              setViewFood(null);
            }}
          >
            {c}
          </div>
        ))}
      </div>

      {/* custom foods strip */}
      {customFoods.length > 0 && (
        <div className="custom-strip">
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: t.acc,
              letterSpacing: ".07em",
              textTransform: "uppercase",
            }}
          >
            My Custom Foods ({customFoods.length})
          </div>
          <div className="custom-tags">
            {customFoods.map((f) => (
              <span key={f.id} className="custom-tag">
                {f.name} · {f.cal} kcal
                <button
                  className="custom-x"
                  onClick={() => {
                    if (confirm(`Delete "${f.name}"?`)) {
                      onDeleteCustom(f.id);
                      if (viewFood?.id === f.id) setViewFood(null);
                    }
                  }}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* food detail */}
      {viewFood && (
        <div className="food-detail">
          <div className="fd-hdr">
            <div className="fd-name">{viewFood.name}</div>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: t.dim,
                fontSize: 18,
                lineHeight: 1,
                flexShrink: 0,
              }}
              onClick={() => setViewFood(null)}
            >
              ✕
            </button>
          </div>
          <div className="fd-cat">{viewFood.category} · per 100g</div>
          <div className="fd-grid">
            <div className="fd-box">
              <div className="fd-val" style={{ color: t.acc }}>
                {viewFood.cal}
              </div>
              <div className="fd-lbl">kcal</div>
            </div>
            <div className="fd-box">
              <div className="fd-val" style={{ color: "#60a5fa" }}>
                {viewFood.protein}g
              </div>
              <div className="fd-lbl">protein</div>
            </div>
            <div className="fd-box">
              <div className="fd-val" style={{ color: "#fb923c" }}>
                {viewFood.carbs}g
              </div>
              <div className="fd-lbl">carbs</div>
            </div>
            <div className="fd-box">
              <div className="fd-val" style={{ color: "#f472b6" }}>
                {viewFood.fat}g
              </div>
              <div className="fd-lbl">fat</div>
            </div>
            <div className="fd-box">
              <div className="fd-val" style={{ color: "#a3e635" }}>
                {viewFood.fiber}g
              </div>
              <div className="fd-lbl">fiber</div>
            </div>
            <div className="fd-box">
              <div className="fd-val" style={{ color: t.txt }}>
                {Math.round(viewFood.cal * 4.18)}kJ
              </div>
              <div className="fd-lbl">energy</div>
            </div>
          </div>
          <button
            className="btn-primary"
            style={{ marginBottom: 0 }}
            onClick={() => {
              onUseInTray(viewFood);
              setViewFood(null);
            }}
          >
            ➕ Use in Meal Tray
          </button>
          {viewFood.id?.startsWith("custom_") && (
            <div className="fd-note">Custom food · saved by you</div>
          )}
        </div>
      )}

      {/* food list */}
      <div style={{ marginTop: 4 }}>
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-ico">🔍</div>
            <div className="empty-txt">
              No foods found.
              <br />
              Try a different name or add one.
            </div>
          </div>
        ) : (
          filtered.map((f) => {
            const isCustom = f.id?.startsWith("custom_");
            return (
              <div
                key={f.id}
                className="food-row"
                onClick={() => setViewFood(viewFood?.id === f.id ? null : f)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 3,
                    }}
                  >
                    <div className="food-row-name" style={{ margin: 0 }}>
                      {f.name}
                    </div>
                    {isCustom && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          background: t.accBg,
                          color: t.acc,
                          borderRadius: 4,
                          padding: "2px 5px",
                          letterSpacing: ".04em",
                          textTransform: "uppercase",
                          flexShrink: 0,
                        }}
                      >
                        custom
                      </span>
                    )}
                  </div>
                  <div className="food-row-meta">
                    P:{f.protein}g · C:{f.carbs}g · F:{f.fat}g · Fiber:{f.fiber}
                    g
                  </div>
                  <div className="food-row-cat">{f.category}</div>
                </div>
                <div
                  style={{ textAlign: "right", flexShrink: 0, minWidth: 56 }}
                >
                  <div className="food-row-cal">{f.cal}</div>
                  <div className="food-row-cal-lbl">kcal/100g</div>
                </div>
                {isCustom && (
                  <div
                    className="row-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="row-edit"
                      onClick={(e) => openEdit(f, e)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="row-del"
                      onClick={(e) => handleDelete(f, e)}
                    >
                      🗑 Del
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* add/edit bottom sheet */}
      {showForm && (
        <div className="overlay" onClick={closeForm}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-hdr">
              <div>
                <div className="sheet-ttl">
                  {form._editId ? "Edit Food" : "Add New Food"}
                </div>
                <div className="sheet-sub">All values per 100g</div>
              </div>
              <button className="sheet-x" onClick={closeForm}>
                ✕
              </button>
            </div>
            {formError && <div className="err">⚠ {formError}</div>}
            <div style={{ marginBottom: 14 }}>
              <label className="form-lbl">Food Name *</label>
              <input
                className="form-inp"
                placeholder="e.g. Lola's Chicken Adobo"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 16,
              }}
            >
              {[
                { key: "cal", label: "Calories (kcal)" },
                { key: "protein", label: "Protein (g)" },
                { key: "carbs", label: "Carbs (g)" },
                { key: "fat", label: "Fat (g)" },
                { key: "fiber", label: "Fiber (g)" },
                { key: "category", label: "Category" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="form-lbl">{label}</label>
                  <input
                    className="form-inp"
                    type={key === "category" ? "text" : "number"}
                    placeholder={key === "category" ? "e.g. Filipino" : "0"}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>
            <button
              className="btn-primary"
              style={{ marginBottom: 0 }}
              onClick={saveForm}
            >
              {form._editId ? "✅ Save Changes" : "💾 Save to Database"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── HomePage — standalone component ───────────────────────────────────────────
function HomePage({ state, handlers, t }) {
  const {
    log,
    mode,
    showKey,
    keyVal,
    keyVis,
    showUsage,
    usage,
    imageB64,
    previewSrc,
    aiLoading,
    error,
    tray,
    search,
    selFood,
    portGrams,
    custGrams,
    allFoods,
  } = state;
  const {
    setMode,
    setShowKey,
    setKeyVal,
    setKeyVis,
    setShowUsage,
    saveKey,
    handleFile,
    clearPreview,
    analyzeFood,
    addToTray,
    setSelFood,
    setSearch,
    setPortGrams,
    setCustGrams,
    setTray,
    logTray,
    setTab,
    setTheme,
    theme,
    deleteEntry,
  } = handlers;

  const todayU = usage.days?.[todayStr()] || { input: 0, output: 0 };
  const totalCost = calcCost(usage.totalInput, usage.totalOutput);
  const todayCost = calcCost(todayU.input, todayU.output);
  const budPct = Math.min(totalCost / BUDGET, 1);
  const dayTok = todayU.input + todayU.output;
  const dayPct = Math.min(dayTok / DAILY_LIMIT, 1);
  const budLeft = Math.max(BUDGET - totalCost, 0);
  const daysLeft = todayCost > 0 ? Math.floor(budLeft / todayCost) : "∞";
  const budColor = budPct > 0.8 ? "#f87171" : budPct > 0.5 ? "#fb923c" : t.acc;
  const dayColor =
    dayPct > 0.8 ? "#f87171" : dayPct > 0.5 ? "#fb923c" : "#60a5fa";
  const allDays = Object.entries(usage.days || {})
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 7);

  const totals = log.reduce(
    (a, e) => ({
      cal: a.cal + (e.calories || 0),
      p: a.p + (e.protein || 0),
      c: a.c + (e.carbs || 0),
      f: a.f + (e.fat || 0),
      fi: a.fi + (e.fiber || 0),
    }),
    { cal: 0, p: 0, c: 0, f: 0, fi: 0 },
  );

  const filteredFoods =
    search.length >= 1
      ? allFoods.filter((f) =>
          f.name.toLowerCase().includes(search.toLowerCase()),
        )
      : [];
  const [showDrop, setShowDrop] = useState(false);
  const previewNut = selFood
    ? scaleFood(selFood, parseFloat(custGrams) || portGrams)
    : null;

  const cameraRef = useRef();
  const galleryRef = useRef();

  return (
    <div className="page">
      {/* header */}
      <div className="hdr">
        <div className="logo">
          Nutri<em>Scan</em>
        </div>
        <div className="hdr-right">
          <div className="hdr-btns">
            <button
              className="icon-btn"
              onClick={() =>
                setTheme((th) => (th === "dark" ? "light" : "dark"))
              }
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              className={`icon-btn${showUsage ? " on" : ""}`}
              onClick={() => setShowUsage((v) => !v)}
            >
              ⚡
            </button>
          </div>
          <div>
            <div className="date-txt">{fmtDate()}</div>
            <div className="date-sub">Daily Tracker</div>
          </div>
        </div>
      </div>

      {/* mode toggle */}
      <div className="mode-bar">
        <button
          className={`mode-btn${mode === "ai" ? " on ai-on" : ""}`}
          onClick={() => {
            setMode("ai");
            if (
              !localStorage.getItem("nutriscan_key") &&
              !import.meta?.env?.VITE_ANTHROPIC_API_KEY
            )
              setShowKey(true);
          }}
        >
          🤖 AI Scan
        </button>
        <button
          className={`mode-btn${mode === "manual" ? " on" : ""}`}
          onClick={() => setMode("manual")}
        >
          ✏️ Manual Entry
        </button>
      </div>

      {/* key banner */}
      {showKey && mode === "ai" && (
        <div className="key-banner">
          <div className="key-lbl">⚡ Add your Claude API key</div>
          <div className="key-row">
            <input
              className="key-inp"
              type={keyVis ? "text" : "password"}
              placeholder="sk-ant-..."
              value={keyVal}
              onChange={(e) => setKeyVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveKey()}
            />
            <button className="key-tog" onClick={() => setKeyVis((v) => !v)}>
              {keyVis ? "🙈" : "👁"}
            </button>
            <button className="key-save" onClick={saveKey}>
              Save
            </button>
          </div>
        </div>
      )}

      {/* usage panel */}
      {showUsage && (
        <div className="usage-panel">
          <div className="usage-ttl">
            Token Monitor
            <button
              className="rst-btn"
              onClick={() => {
                if (confirm("Reset token history?")) handlers.resetUsage();
              }}
            >
              Reset
            </button>
          </div>
          <div className="bar-row">
            <div className="bar-top">
              <span className="bar-lbl">Budget Used</span>
              <span style={{ fontWeight: 700, fontSize: 12, color: budColor }}>
                ${totalCost.toFixed(4)}{" "}
                <span style={{ color: t.dim, fontWeight: 400 }}>/ $5.00</span>
              </span>
            </div>
            <div className="bar-trk">
              <div
                className="bar-fill"
                style={{ width: `${budPct * 100}%`, background: budColor }}
              />
            </div>
          </div>
          <div className="bar-row">
            <div className="bar-top">
              <span className="bar-lbl">Today's Tokens</span>
              <span style={{ fontWeight: 700, fontSize: 12, color: dayColor }}>
                {dayTok.toLocaleString()}{" "}
                <span style={{ color: t.dim, fontWeight: 400 }}>/ 10,000</span>
              </span>
            </div>
            <div className="bar-trk">
              <div
                className="bar-fill"
                style={{ width: `${dayPct * 100}%`, background: dayColor }}
              />
            </div>
          </div>
          <div className="stat-grid">
            <div className="stat-box">
              <div className="stat-val" style={{ color: t.acc }}>
                ${budLeft.toFixed(3)}
              </div>
              <div className="stat-lbl">Budget left</div>
            </div>
            <div className="stat-box">
              <div className="stat-val" style={{ color: "#60a5fa" }}>
                {typeof daysLeft === "number" ? daysLeft + "d" : "∞"}
              </div>
              <div className="stat-lbl">Days left*</div>
            </div>
            <div className="stat-box">
              <div className="stat-val" style={{ color: "#f472b6" }}>
                ${todayCost.toFixed(4)}
              </div>
              <div className="stat-lbl">Today's cost</div>
            </div>
          </div>
          {allDays.length > 0 && (
            <>
              <div className="hist-ttl">Last {allDays.length} days</div>
              {allDays.map(([date, d]) => {
                const tok = d.input + d.output,
                  mx = Math.max(
                    ...allDays.map(([, x]) => x.input + x.output),
                    1,
                  ),
                  isT = date === todayStr();
                return (
                  <div key={date} className="hist-row">
                    <div
                      className="hist-date"
                      style={{ color: isT ? t.acc : t.dim }}
                    >
                      {isT ? "Today" : date.slice(5)}
                    </div>
                    <div className="hist-bar-w">
                      <div
                        className="hist-bar"
                        style={{
                          width: `${(tok / mx) * 100}%`,
                          background: isT ? t.acc : t.hist,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: t.dim,
                        minWidth: 50,
                        textAlign: "right",
                      }}
                    >
                      {tok.toLocaleString()}
                    </div>
                    <div className="hist-cost">
                      ${calcCost(d.input, d.output).toFixed(4)}
                    </div>
                  </div>
                );
              })}
              <div style={{ fontSize: 10, color: t.faint, marginTop: 8 }}>
                * Based on today's rate
              </div>
            </>
          )}
          {allDays.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "14px 0",
                fontSize: 13,
                color: t.dim,
              }}
            >
              No usage yet.
            </div>
          )}
        </div>
      )}

      <CalRing totals={totals} t={t} />

      {/* AI mode */}
      {mode === "ai" && (
        <>
          {previewSrc && (
            <div className="img-preview">
              <img src={previewSrc} alt="food" />
              <div className="img-grad" />
              <div className="img-tag">Ready to analyze</div>
              <button className="img-x" onClick={clearPreview}>
                ✕
              </button>
            </div>
          )}
          {error && <div className="err">⚠ {error}</div>}
          {previewSrc ? (
            <button
              className="btn-primary"
              onClick={analyzeFood}
              disabled={aiLoading}
            >
              {aiLoading ? (
                <>
                  <div className="spinner" />
                  Analyzing...
                </>
              ) : (
                <>🔍 Analyze This Food</>
              )}
            </button>
          ) : (
            <div className="scan-row">
              <button
                className="btn-cam"
                onClick={() => cameraRef.current?.click()}
              >
                📷 Camera
              </button>
              <label className="btn-gal">
                🖼 Gallery
                <input
                  ref={galleryRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          )}
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            style={{ display: "none" }}
          />
        </>
      )}

      {/* Manual mode */}
      {mode === "manual" && (
        <div className="manual-panel">
          <div className="manual-ttl">
            Add to Meal Tray
            <button
              className="btn-sm"
              style={{ fontSize: 11 }}
              onClick={() => setTab("foods")}
            >
              Browse Foods →
            </button>
          </div>
          <div className="srch-wrap">
            <input
              className="srch-inp"
              placeholder="Search food (adobo, rice, tuna...)"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDrop(true);
                setSelFood(null);
              }}
              onFocus={() => setShowDrop(true)}
            />
            {showDrop && search.length >= 1 && (
              <div className="dropdown">
                {filteredFoods.length > 0 ? (
                  filteredFoods.slice(0, 10).map((f) => (
                    <div
                      key={f.id}
                      className="drop-item"
                      onClick={() => {
                        setSelFood(f);
                        setSearch(f.name);
                        setShowDrop(false);
                        setPortGrams(100);
                        setCustGrams("");
                      }}
                    >
                      <div className="drop-name">{f.name}</div>
                      <div className="drop-meta">
                        {f.cal} kcal · P:{f.protein}g C:{f.carbs}g F:{f.fat}g{" "}
                        <span style={{ color: t.faint }}>per 100g</span>
                      </div>
                      <div className="drop-cat">{f.category}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-result">
                    No match.{" "}
                    <span
                      style={{ color: t.acc, cursor: "pointer" }}
                      onClick={() => setTab("foods")}
                    >
                      Add a custom food →
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          {selFood && (
            <div className="sel-card">
              <div className="sel-name">{selFood.name}</div>
              <div className="sel-meta">
                {selFood.cal} kcal per 100g · {selFood.category}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: t.muted,
                  fontWeight: 600,
                  marginBottom: 7,
                }}
              >
                Portion:
              </div>
              <div className="port-row">
                {PORTIONS.slice(0, 5).map((p) => (
                  <div
                    key={p.label}
                    className={`port-chip${portGrams === p.grams && !custGrams ? " on" : ""}`}
                    onClick={() => {
                      setPortGrams(p.grams);
                      setCustGrams("");
                    }}
                  >
                    {p.label}
                  </div>
                ))}
                <input
                  className="cust-inp"
                  type="number"
                  placeholder="Custom g"
                  value={custGrams}
                  onChange={(e) => setCustGrams(e.target.value)}
                />
              </div>
              {previewNut && (
                <div className="prev-grid">
                  <div className="prev-box">
                    <div className="prev-val" style={{ color: t.acc }}>
                      {previewNut.calories}
                    </div>
                    <div className="prev-lbl">kcal</div>
                  </div>
                  <div className="prev-box">
                    <div className="prev-val" style={{ color: "#60a5fa" }}>
                      {previewNut.protein}g
                    </div>
                    <div className="prev-lbl">protein</div>
                  </div>
                  <div className="prev-box">
                    <div className="prev-val" style={{ color: "#fb923c" }}>
                      {previewNut.carbs}g
                    </div>
                    <div className="prev-lbl">carbs</div>
                  </div>
                  <div className="prev-box">
                    <div className="prev-val" style={{ color: "#f472b6" }}>
                      {previewNut.fat}g
                    </div>
                    <div className="prev-lbl">fat</div>
                  </div>
                </div>
              )}
              {error && (
                <div className="err" style={{ marginBottom: 8 }}>
                  ⚠ {error}
                </div>
              )}
              <button
                className="btn-primary"
                style={{ marginBottom: 0 }}
                onClick={addToTray}
              >
                ➕ Add to Tray
              </button>
            </div>
          )}
        </div>
      )}

      <div className="sec-ttl" style={{ marginTop: 16 }}>
        Today's Log
      </div>
      {log.length === 0 ? (
        <div className="empty">
          <div className="empty-ico">🥗</div>
          <div className="empty-txt">
            Nothing logged yet.
            <br />
            {mode === "manual"
              ? "Search and add foods above."
              : "Scan or upload a food photo."}
          </div>
        </div>
      ) : (
        [...log]
          .reverse()
          .map((e, ri) => (
            <LogItem
              key={ri}
              e={e}
              i={log.length - 1 - ri}
              onDelete={deleteEntry}
            />
          ))
      )}
    </div>
  );
}

// ── LogPage — standalone component ────────────────────────────────────────────
function LogPage({ log, t, deleteEntry }) {
  const totals = log.reduce(
    (a, e) => ({
      cal: a.cal + (e.calories || 0),
      p: a.p + (e.protein || 0),
      c: a.c + (e.carbs || 0),
      f: a.f + (e.fat || 0),
      fi: a.fi + (e.fiber || 0),
    }),
    { cal: 0, p: 0, c: 0, f: 0, fi: 0 },
  );
  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "-1px",
            color: t.txt,
          }}
        >
          Today's Log
        </div>
        <div style={{ fontSize: 13, color: t.muted }}>
          {log.length} item{log.length !== 1 ? "s" : ""}
        </div>
      </div>
      <CalRing totals={totals} t={t} />
      {log.length === 0 ? (
        <div className="empty">
          <div className="empty-ico">📋</div>
          <div className="empty-txt">
            No food logged today.
            <br />
            Head to Home to start scanning.
          </div>
        </div>
      ) : (
        [...log]
          .reverse()
          .map((e, ri) => (
            <LogItem
              key={ri}
              e={e}
              i={log.length - 1 - ri}
              onDelete={deleteEntry}
            />
          ))
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function NutriScan() {
  const [log, setLog] = useState(loadLog);
  const [customFoods, setCustomFoods] = useState(loadCustom);
  const [usage, setUsage] = useState(loadUsage);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("nutriscan_theme") || "dark",
  );
  const [mode, setMode] = useState(
    () => localStorage.getItem("nutriscan_mode") || "ai",
  );
  const [tab, setTab] = useState("home");
  const [showKey, setShowKey] = useState(false);
  const [keyVal, setKeyVal] = useState("");
  const [keyVis, setKeyVis] = useState(false);
  const [showUsage, setShowUsage] = useState(false);
  const [imageB64, setImageB64] = useState(null);
  const [imageType, setImageType] = useState("image/jpeg");
  const [previewSrc, setPreviewSrc] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tray, setTray] = useState([]);
  const [showTray, setShowTray] = useState(false);
  const [search, setSearch] = useState("");
  const [selFood, setSelFood] = useState(null);
  const [portGrams, setPortGrams] = useState(100);
  const [custGrams, setCustGrams] = useState("");

  const t = T[theme];
  const API_KEY =
    (typeof import_meta !== "undefined" &&
      import_meta?.env?.VITE_ANTHROPIC_API_KEY) ||
    localStorage.getItem("nutriscan_key");
  const allFoods = [...BUILT_IN_FOODS, ...customFoods];

  useEffect(() => {
    if (!API_KEY && mode === "ai") setShowKey(true);
  }, []);
  useEffect(() => {
    saveLog(log);
  }, [log]);
  useEffect(() => {
    localStorage.setItem("nutriscan_theme", theme);
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("nutriscan_mode", mode);
  }, [mode]);
  useEffect(() => {
    saveCustom(customFoods);
  }, [customFoods]);

  function saveKey() {
    if (!keyVal.trim()) return;
    localStorage.setItem("nutriscan_key", keyVal.trim());
    setShowKey(false);
  }
  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setImageType(f.type || "image/jpeg");
    const r = new FileReader();
    r.onload = (ev) => {
      setImageB64(ev.target.result.split(",")[1]);
      setPreviewSrc(ev.target.result);
      setError(null);
    };
    r.readAsDataURL(f);
  }
  function clearPreview() {
    setImageB64(null);
    setPreviewSrc(null);
    setError(null);
  }

  async function analyzeFood() {
    const key = API_KEY;
    if (!key) {
      setShowKey(true);
      return;
    }
    if (!imageB64) return;
    setAiLoading(true);
    setError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 800,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: imageType,
                    data: imageB64,
                  },
                },
                {
                  type: "text",
                  text: `You are a nutrition expert. Analyze this food image and respond ONLY with a JSON object, no markdown. Format: {"name":"food name","portion":"estimated portion","calories":number,"protein":number,"carbs":number,"fat":number,"fiber":number,"sugar":number,"sodium":number,"insight":"one short health tip under 20 words"} All nutrients in grams except sodium(mg) and calories(kcal).`,
                },
              ],
            },
          ],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setUsage({
        ...recordUsage(
          data.usage?.input_tokens || 0,
          data.usage?.output_tokens || 0,
        ),
      });
      const food = JSON.parse(
        data.content[0].text
          .trim()
          .replace(/```json|```/g, "")
          .trim(),
      );
      food.thumb = previewSrc;
      food.time = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      food.source = "ai";
      setLog((prev) => [...prev, food]);
      clearPreview();
    } catch (err) {
      setError("Could not analyze: " + (err.message || "Unknown error"));
    } finally {
      setAiLoading(false);
    }
  }

  function addToTray() {
    if (!selFood) {
      setError("Select a food first.");
      return;
    }
    const g = parseFloat(custGrams) || portGrams;
    if (!g || g <= 0) {
      setError("Enter a valid portion.");
      return;
    }
    const scaled = scaleFood(selFood, g);
    setTray((prev) => [
      ...prev,
      {
        ...scaled,
        name: selFood.name,
        portion: `${g}g`,
        source: "manual",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setSelFood(null);
    setSearch("");
    setCustGrams("");
    setPortGrams(100);
    setError(null);
  }

  function logTray() {
    if (!tray.length) return;
    setLog((prev) => [...prev, ...tray]);
    setTray([]);
    setShowTray(false);
  }
  function deleteEntry(i) {
    setLog((prev) => prev.filter((_, idx) => idx !== i));
  }
  function resetUsage() {
    localStorage.removeItem("nutriscan_usage");
    setUsage(loadUsage());
  }

  function onSaveFood(form) {
    if (form._editId) {
      setCustomFoods((prev) =>
        prev.map((f) =>
          f.id === form._editId
            ? {
                ...f,
                name: form.name,
                cal: +form.cal,
                protein: +form.protein,
                carbs: +form.carbs,
                fat: +form.fat,
                fiber: +form.fiber,
                category: form.category,
              }
            : f,
        ),
      );
    } else {
      const f = {
        id: "custom_" + Date.now(),
        name: form.name,
        cal: +form.cal,
        protein: +form.protein,
        carbs: +form.carbs,
        fat: +form.fat,
        fiber: +form.fiber,
        category: form.category,
      };
      setCustomFoods((prev) => [...prev, f]);
    }
  }

  function onUseInTray(food) {
    setSelFood(food);
    setSearch(food.name);
    setMode("manual");
    setTab("home");
  }

  const trayTotals = tray.reduce(
    (a, e) => ({
      cal: a.cal + e.calories,
      p: a.p + e.protein,
      c: a.c + e.carbs,
      f: a.f + e.fat,
    }),
    { cal: 0, p: 0, c: 0, f: 0 },
  );

  const homeState = {
    log,
    mode,
    showKey,
    keyVal,
    keyVis,
    showUsage,
    usage,
    imageB64,
    previewSrc,
    aiLoading,
    error,
    tray,
    search,
    selFood,
    portGrams,
    custGrams,
    allFoods,
  };
  const homeHandlers = {
    setMode,
    setShowKey,
    setKeyVal,
    setKeyVis,
    setShowUsage,
    saveKey,
    handleFile,
    clearPreview,
    analyzeFood,
    addToTray,
    setSelFood,
    setSearch,
    setPortGrams,
    setCustGrams,
    setTray,
    logTray,
    setTab,
    setTheme,
    theme,
    deleteEntry,
    resetUsage,
  };

  return (
    <>
      <style>{makeCSS(t)}</style>
      <div className="app">
        {tab === "home" && (
          <HomePage state={homeState} handlers={homeHandlers} t={t} />
        )}
        {tab === "foods" && (
          <FoodsPage
            allFoods={allFoods}
            customFoods={customFoods}
            t={t}
            onDeleteCustom={(id) =>
              setCustomFoods((prev) => prev.filter((f) => f.id !== id))
            }
            onSaveFood={onSaveFood}
            onUseInTray={onUseInTray}
          />
        )}
        {tab === "log" && <LogPage log={log} t={t} deleteEntry={deleteEntry} />}
      </div>

      {/* floating tray */}
      {tray.length > 0 && (
        <button className="tray-fab" onClick={() => setShowTray(true)}>
          <div className="tray-badge">{tray.length}</div>
          Meal Tray · {Math.round(trayTotals.cal)} kcal
        </button>
      )}

      {/* tray sheet */}
      {showTray && (
        <div className="overlay" onClick={() => setShowTray(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-hdr">
              <div>
                <div className="sheet-ttl">
                  🍱 Meal Tray ({tray.length} item{tray.length !== 1 ? "s" : ""}
                  )
                </div>
              </div>
              <button className="sheet-x" onClick={() => setShowTray(false)}>
                ✕
              </button>
            </div>
            {tray.map((item, i) => (
              <div key={i} className="tray-item">
                <div>
                  <div className="tray-item-name">{item.name}</div>
                  <div className="tray-item-meta">
                    {item.portion} · P:{item.protein}g C:{item.carbs}g F:
                    {item.fat}g
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="tray-item-cal">{item.calories}</div>
                  <button
                    className="tray-del"
                    onClick={() =>
                      setTray((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <div className="tray-sum">
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: t.muted,
                  letterSpacing: ".07em",
                  textTransform: "uppercase",
                }}
              >
                Meal Total
              </div>
              <div className="tray-sum-grid">
                <div className="tray-sum-box">
                  <div className="tray-sum-val" style={{ color: t.acc }}>
                    {Math.round(trayTotals.cal)}
                  </div>
                  <div className="tray-sum-lbl">kcal</div>
                </div>
                <div className="tray-sum-box">
                  <div className="tray-sum-val" style={{ color: "#60a5fa" }}>
                    {Math.round(trayTotals.p)}g
                  </div>
                  <div className="tray-sum-lbl">protein</div>
                </div>
                <div className="tray-sum-box">
                  <div className="tray-sum-val" style={{ color: "#fb923c" }}>
                    {Math.round(trayTotals.c)}g
                  </div>
                  <div className="tray-sum-lbl">carbs</div>
                </div>
                <div className="tray-sum-box">
                  <div className="tray-sum-val" style={{ color: "#f472b6" }}>
                    {Math.round(trayTotals.f)}g
                  </div>
                  <div className="tray-sum-lbl">fat</div>
                </div>
              </div>
            </div>
            <button
              className="btn-primary"
              onClick={logTray}
              style={{ marginBottom: 0 }}
            >
              ✅ Log Entire Meal
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                setTray([]);
                setShowTray(false);
              }}
              style={{ marginTop: 8 }}
            >
              🗑 Clear Tray
            </button>
          </div>
        </div>
      )}

      {/* bottom tab bar */}
      <div className="tab-bar">
        <button
          className={`tab-btn${tab === "home" ? " on" : ""}`}
          onClick={() => setTab("home")}
        >
          <div className="tab-icon">🏠</div>
          <div className="tab-lbl">Home</div>
        </button>
        <button
          className={`tab-btn${tab === "foods" ? " on" : ""}`}
          onClick={() => setTab("foods")}
        >
          <div className="tab-icon">🥦</div>
          <div className="tab-lbl">Foods</div>
        </button>
        <button
          className={`tab-btn${tab === "log" ? " on" : ""}`}
          onClick={() => setTab("log")}
        >
          <div className="tab-icon">
            📋
            {log.length > 0 && <span className="tab-badge">{log.length}</span>}
          </div>
          <div className="tab-lbl">Log</div>
        </button>
      </div>
    </>
  );
}

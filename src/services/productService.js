import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const COL = "products";

export const getProducts = async () => {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getProductById = async (id) => {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getProductsByCategory = async (category) => {
  const q = query(collection(db, COL), where("category", "==", category));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getFeaturedProducts = async () => {
  const q = query(collection(db, COL), where("featured", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const searchProducts = async (term) => {
  const all = await getProducts();
  const lower = term.toLowerCase();
  return all.filter(
    (p) =>
      p.name?.toLowerCase().includes(lower) ||
      p.category?.toLowerCase().includes(lower) ||
      p.tags?.some((t) => t.toLowerCase().includes(lower))
  );
};

export const addProduct = async (data) => {
  return await addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp() });
};

export const updateProduct = async (id, data) => {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, COL, id));
};

export const getCategories = async () => {
  const snap = await getDocs(collection(db, "categories"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const seedCategories = async () => {
  const defaults = [
    { name: "Fruits & Vegetables", slug: "fruits-vegetables", emoji: "🥦", imageURL: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200" },
    { name: "Dairy & Bread", slug: "dairy-bread", emoji: "🥛", imageURL: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200" },
    { name: "Snacks & Munchies", slug: "snacks-munchies", emoji: "🍟", imageURL: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200" },
    { name: "Cold Drinks & Juices", slug: "cold-drinks-juices", emoji: "🥤", imageURL: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200" },
    { name: "Breakfast & Instant", slug: "breakfast-instant", emoji: "🥣", imageURL: "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=200" },
    { name: "Bakery & Biscuits", slug: "bakery-biscuits", emoji: "🍪", imageURL: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200" },
    { name: "Tea, Coffee & More", slug: "tea-coffee", emoji: "☕", imageURL: "https://images.unsplash.com/photo-1495774856032-8b90bbb32b32?w=200" },
    { name: "Atta, Rice & Dal", slug: "atta-rice-dal", emoji: "🌾", imageURL: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200" },
    { name: "Personal Care", slug: "personal-care", emoji: "🧴", imageURL: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=200" },
    { name: "Household", slug: "household", emoji: "🧹", imageURL: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200" },
    { name: "Baby Care", slug: "baby-care", emoji: "👶", imageURL: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200" },
    { name: "Pharmacy", slug: "pharmacy", emoji: "💊", imageURL: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200" },
  ];

  const existing = await getCategories();
  const existingSlugs = existing.map(e => e.slug);

  for (const cat of defaults) {
    if (!existingSlugs.includes(cat.slug)) {
      await addDoc(collection(db, "categories"), cat);
    }
  }
};

export const seedSampleProducts = async () => {
  const existing = await getProducts();
  if (existing.length > 0) return;

  const samples = [
    { name: "Heritage Fresh Toned Milk", price: 29, mrp: 30, category: "Dairy & Bread", unit: "500 ml", imageURL: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300", stock: 50, featured: true, tags: ["milk", "dairy", "fresh"] },
    { name: "Lay's American Style Cream & Onion", price: 25, mrp: 30, category: "Snacks & Munchies", unit: "52 g", imageURL: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300", stock: 100, featured: true, tags: ["chips", "snacks", "lays"] },
    { name: "Aashirvaad Whole Wheat Atta", price: 279, mrp: 310, category: "Atta, Rice & Dal", unit: "5 kg", imageURL: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300", stock: 30, featured: true, tags: ["atta", "wheat", "flour"] },
    { name: "Tropicana Orange Juice", price: 99, mrp: 120, category: "Cold Drinks & Juices", unit: "1 L", imageURL: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300", stock: 60, featured: false, tags: ["juice", "orange", "drinks"] },
    { name: "Britannia Good Day Butter Cookies", price: 35, mrp: 40, category: "Bakery & Biscuits", unit: "250 g", imageURL: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300", stock: 80, featured: false, tags: ["cookies", "biscuits", "bakery"] },
    { name: "Tata Tea Premium", price: 135, mrp: 150, category: "Tea, Coffee & More", unit: "250 g", imageURL: "https://images.unsplash.com/photo-1495774856032-8b90bbb32b32?w=300", stock: 40, featured: false, tags: ["tea", "tata", "beverages"] },
    { name: "Fresh Bananas", price: 49, mrp: 60, category: "Fruits & Vegetables", unit: "6 pcs", imageURL: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300", stock: 70, featured: true, tags: ["banana", "fruits", "fresh"] },
    { name: "Kurkure Masala Munch", price: 20, mrp: 20, category: "Snacks & Munchies", unit: "75 g", imageURL: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300", stock: 150, featured: false, tags: ["kurkure", "chips", "snacks"] },
    { name: "Dettol Hand Wash", price: 79, mrp: 90, category: "Personal Care", unit: "200 ml", imageURL: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300", stock: 90, featured: false, tags: ["handwash", "dettol", "hygiene"] },
    { name: "Maggi 2 Minute Noodles", price: 14, mrp: 14, category: "Breakfast & Instant", unit: "70 g", imageURL: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=300", stock: 200, featured: true, tags: ["maggi", "noodles", "instant"] },
    { name: "Amul Butter", price: 55, mrp: 60, category: "Dairy & Bread", unit: "100 g", imageURL: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300", stock: 45, featured: false, tags: ["butter", "amul", "dairy"] },
    { name: "Coca-Cola 750ml", price: 45, mrp: 50, category: "Cold Drinks & Juices", unit: "750 ml", imageURL: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300", stock: 100, featured: false, tags: ["coke", "cola", "drinks"] },
    { name: "Nescafe Classic Coffee", price: 225, mrp: 250, category: "Tea, Coffee & More", unit: "100 g", imageURL: "https://images.unsplash.com/photo-1495774856032-8b90bbb32b32?w=300", stock: 35, featured: false, tags: ["coffee", "nescafe", "instant"] },
    { name: "Fresh Tomatoes", price: 39, mrp: 45, category: "Fruits & Vegetables", unit: "500 g", imageURL: "https://images.unsplash.com/photo-1546094096-0df4bcaad337?w=300", stock: 80, featured: false, tags: ["tomato", "vegetables", "fresh"] },
    { name: "Vim Dishwash Bar", price: 25, mrp: 30, category: "Household", unit: "200 g", imageURL: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300", stock: 120, featured: false, tags: ["vim", "dishwash", "cleaning"] },
    { name: "Parle-G Biscuits", price: 10, mrp: 10, category: "Bakery & Biscuits", unit: "100 g", imageURL: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300", stock: 200, featured: false, tags: ["parle", "biscuits", "glucose"] },
  ];

  for (const p of samples) {
    await addDoc(collection(db, "products"), { ...p, createdAt: serverTimestamp(), description: `Premium quality ${p.name}. Sourced fresh and delivered to your doorstep in minutes.` });
  }
};

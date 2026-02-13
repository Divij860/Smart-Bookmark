# 🔖 Realtime Bookmark Manager

A production-ready fullstack bookmark management application built with **Next.js + Supabase**, featuring secure authentication, realtime synchronization, inline editing, search filtering, and polished UX.

---

## 🚀 Live Demo

[_Add deployed link here_](https://smart-bookmark-inky.vercel.app/)

## 📂 Repository

[_Add GitHub repository link here_](https://github.com/Divij860/Smart-Bookmark)

---

# 📌 Project Overview

This application allows authenticated users to manage personal bookmarks in a secure and realtime environment.

### Users can:

- ➕ Add bookmarks  
- ✏ Edit bookmarks inline  
- 🗑 Delete bookmarks  
- 🔎 Search bookmarks instantly  
- 🔄 See realtime updates across multiple tabs  
- ✨ Experience smooth animations and responsive UI  

The project focuses on:

- ✅ Correctness  
- 🔒 Security  
- ⚡ Performance  
- 🎨 User Experience  

---

# 🛠 Tech Stack

## 🎨 Frontend

- Next.js (App Router)
- React
- TypeScript
- TailwindCSS
- Framer Motion
- React Hot Toast
- Lucide Icons

## 🗄 Backend

- Supabase
- PostgreSQL
- Authentication
- Realtime subscriptions
- Row Level Security (RLS)

---

# 🧠 Architecture Decisions

## 1️⃣ Optimized Realtime State Management

Instead of refetching the entire bookmarks table on every realtime event, the application listens to Supabase `postgres_changes` and updates local state selectively:

- `INSERT` → prepend to state  
- `DELETE` → remove from state  
- `UPDATE` → merge updated record  

### Benefits:

- Reduced database reads  
- Better scalability  
- Improved responsiveness  
- Efficient state handling  

---

## 2️⃣ Secure Row Level Security (RLS)

RLS is enabled on the `bookmarks` table.

### Policies implemented:

- **SELECT** → `auth.uid() = user_id`
- **INSERT** → `auth.uid() = user_id`
- **UPDATE** → `auth.uid() = user_id`
- **DELETE** → `auth.uid() = user_id`

This guarantees complete user data isolation.

---

## 3️⃣ Realtime Configuration

To ensure `UPDATE` and `DELETE` events broadcast correctly:

```sql
ALTER TABLE public.bookmarks REPLICA IDENTITY FULL;

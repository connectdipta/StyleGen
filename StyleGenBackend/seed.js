import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/userModel.js";
import Product from "./src/models/productModel.js";
import Category from "./src/models/categoryModel.js";
import bcrypt from "bcrypt";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected for seeding...");

        // 1. Clear existing data (Optional - comment out if you want to keep old data)
        // await User.deleteMany();
        // await Product.deleteMany();
        // await Category.deleteMany();

        // 2. Create Admin if not exists
        let admin = await User.findOne({ email: "admin@stylegen.com" });
        if (!admin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            admin = await User.create({
                name: "StyleGen Admin",
                email: "admin@stylegen.com",
                password: hashedPassword,
                role: "admin",
            });
            console.log("Admin created: admin@stylegen.com / admin123");
        }

        // 3. Create Categories
        const categories = ["Shoes", "Wallet", "Bags", "Belt", "T-Shirt"];
        const categoryDocs = [];

        for (const name of categories) {
            let cat = await Category.findOne({ name });
            if (!cat) {
                cat = await Category.create({ name, description: `${name} category`, user: admin._id });
            }
            categoryDocs.push(cat);
        }
        console.log("Categories ready.");

        // 4. Create Mock Products from Figma
        const products = [
            {
                name: "Stylish Original Leather Casual Loafer (SG-01)",
                description: "Premium handcrafted leather shoes for formal and casual wear.",
                price: 1200,
                discountPrice: 1499,
                stock: 50,
                image: "/images/products/shoes.jpg",
                category: categoryDocs.find(c => c.name === "Shoes")._id,
                user: admin._id
            },
            {
                name: "Premium Leather Bi-fold Wallet",
                description: "Elegant and slim leather wallet with multiple card slots.",
                price: 750,
                discountPrice: 950,
                stock: 100,
                image: "/images/products/wallet.jpg",
                category: categoryDocs.find(c => c.name === "Wallet")._id,
                user: admin._id
            },
            {
                name: "Classic Formal Leather Belt",
                description: "High-quality leather belt for professional look.",
                price: 990,
                discountPrice: 1200,
                stock: 80,
                image: "/images/products/belt.jpg",
                category: categoryDocs.find(c => c.name === "Belt")._id,
                user: admin._id
            },
            {
                name: "Cotton Comfort Fit T-Shirt",
                description: "Breathable and soft cotton t-shirt for daily use.",
                price: 550,
                discountPrice: 800,
                stock: 200,
                image: "/images/products/tshirt.jpg",
                category: categoryDocs.find(c => c.name === "T-Shirt")._id,
                user: admin._id
            },
            {
                name: "Handcrafted Leather Travel Bag",
                description: "Spacious leather bag for your weekend trips.",
                price: 3800,
                discountPrice: 4500,
                stock: 15,
                image: "/images/products/bags.jpg",
                category: categoryDocs.find(c => c.name === "Bags")._id,
                user: admin._id
            }
        ];

        for (const p of products) {
            const exists = await Product.findOne({ name: p.name });
            if (!exists) {
                await Product.create(p);
            }
        }

        console.log("Database seeded successfully with Figma products!");
        process.exit();
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedData();

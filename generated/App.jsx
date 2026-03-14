import ProductCard from "@/components/ProductCard";

const products = [
  {
    id: 1,
    name: "Tai nghe Bluetooth Sony WH-1000XM5",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    price: 7490000,
    originalPrice: 9990000,
    badge: "Sale",
  },
  {
    id: 2,
    name: "Giày Nike Air Max 270 React",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    price: 2850000,
    originalPrice: 3500000,
    badge: "Mới",
  },
  {
    id: 3,
    name: "Bình giữ nhiệt Stanley Classic 1L",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop",
    price: 1290000,
    originalPrice: null,
    badge: null,
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Sản phẩm nổi bật</h1>
      <div className="flex flex-wrap gap-6 justify-center">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}

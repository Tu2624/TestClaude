export default function ProductCard({ image, name, price, originalPrice, badge }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-72 hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-56 object-cover"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-gray-800 font-semibold text-base leading-tight line-clamp-2 mb-3">
          {name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-red-500 font-bold text-xl">
            {price.toLocaleString("vi-VN")}₫
          </span>
          {originalPrice && (
            <span className="text-gray-400 text-sm line-through">
              {originalPrice.toLocaleString("vi-VN")}₫
            </span>
          )}
        </div>

        {originalPrice && (
          <div className="mt-1 text-green-600 text-xs font-medium">
            Tiết kiệm {((1 - price / originalPrice) * 100).toFixed(0)}%
          </div>
        )}

        <button className="mt-4 w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-2 rounded-xl transition-colors duration-200 text-sm">
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}

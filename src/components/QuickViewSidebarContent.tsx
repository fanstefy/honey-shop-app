const QuickViewSidebarContent: React.FC<{ product: any }> = ({ product }) => {
  if (!product)
    return <div className="text-gray-500">No product selected.</div>;

  return (
    <div>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded mb-4"
      />
      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
      <p className="text-yellow-700 font-semibold mb-2">${product.price}</p>
      <p className="text-gray-700 mb-2">{product.description}</p>
      {/* Add more product details as needed */}
    </div>
  );
};

export default QuickViewSidebarContent;

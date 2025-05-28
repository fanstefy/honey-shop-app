import { useParams } from "react-router-dom";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Placeholder data for product details
  const product = {
    id,
    name: "Honey Product Name",
    description: "This is a detailed description of the honey product.",
    price: "$10.00",
    image: "path/to/image.jpg",
  };

  return (
    <div className="product-details">
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
    </div>
  );
};

export default ProductDetails;

import ProductItem from "../components/ProductItem";

const products = [
  {
    id: 1,
    name: "Wildflower Honey",
    image: "/images/wildflower-honey.jpg",
    price: "$10.00",
  },
  {
    id: 2,
    name: "Clover Honey",
    image: "/images/clover-honey.jpg",
    price: "$12.00",
  },
  {
    id: 3,
    name: "Manuka Honey",
    image: "/images/manuka-honey.jpg",
    price: "$25.00",
  },
  {
    id: 4,
    name: "Orange Blossom Honey",
    image: "/images/orange-blossom-honey.jpg",
    price: "$15.00",
  },
];

const Home: React.FC = () => {
  return (
    <div className="container mx-auto items-center mt-8 py-10 px-5 min-h-screen">
      <div className="flex sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl">
        {/* {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))} */}
      </div>
    </div>
  );
};

export default Home;

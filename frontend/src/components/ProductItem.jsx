import { Link } from "react-router-dom";
import toVND from "../utils/helper";

const ProductItem = ({ id, image, name, price }) => {
  console.log('check id: ', id);
  return (
    <Link
      onClick={() => window.scrollTo(0, 0)}
      to={`/collections/${id}`}
      className="text-gray-700 cursor-pointer"
    >
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out"
          src={image}
          alt={name}
        />
      </div>
      <p className="pt-3 pb-1 text-base font-bold">{name}</p>
      <p className="text-sm font-medium">{toVND(price)}</p>
    </Link>
  );
};

export default ProductItem;

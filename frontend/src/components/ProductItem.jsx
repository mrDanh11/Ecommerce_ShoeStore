import { Link } from "react-router-dom";
import toVND from "../utils/helper";

const ProductItem = ({ _id, image, name, price }) => {
  return (
    <Link onClick={()=>scrollTo(0,0)} to={`/product/${_id}`} className='text-gray-700 cursor-pointer'>
      <div className='overflow-hidden'>
        <img className='hover:scale-110 transition ease-in-out'
          src={image}
          alt={name}
        />
      </div>
      <p className='pt-3 pb-1 text-base font-bold'>{name}</p>
      <p className='text-sm font-medium'>{toVND(price)}</p>
    </Link>
  );
};

export default ProductItem;

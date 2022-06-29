import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';

function ListingItem({ data, id, categoryName, onDelete }) {
  return (
    <li>
      <Link to={`/category/${data.type}/${id}`} className="categoryListingLink">
        <div className="categoryListing">
          <div
            className="categoryListingImg"
            style={{
              background: `url(${data.imageUrls[0]}) center no-repeat`,
              backgroundSize: 'cover',
            }}
          ></div>
          <div className="categoryListingDetails">
            <p className="categoryListingLocation">{data.location}</p>
            <p className="categoryListingName">{data.name}</p>
            <p className="categoryListingPrice">
              $
              {data.offer
                ? data.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : data.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              {categoryName === 'rent' && ' / Month'}
            </p>
            <div className="categoryListingInfoDiv">
              <img src={bedIcon} alt="bed" />
              <p className="categoryListingInfoText">
                {data.bedrooms} Bedroom{data.bedrooms > 1 && 's'}
              </p>
              <img src={bathtubIcon} alt="bathtub" />
              <p className="categoryListingInfoText">
                {data.bathrooms} Bathroom{data.bathrooms > 1 && 's'}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className="removeIcon"
          fill="rgb(231,76,60)"
          onclick={onDelete(id, data.name)}
        />
      )}
    </li>
  );
}

export default ListingItem;

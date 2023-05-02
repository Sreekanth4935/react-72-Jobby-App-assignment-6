import {AiTwotoneStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobCard = props => {
  const {eachOne} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = eachOne

  return (
    <li className="list-element-container">
      <div className="top-one">
        <img
          src={companyLogoUrl}
          alt={employmentType}
          className="company-image"
        />
        <div className="second-one">
          <p className="tittle">{title}</p>
          <div className="rating-container ">
            <AiTwotoneStar className="star" />
            <p className="ratings">{rating}</p>
          </div>
        </div>
      </div>
      <div>
        <h1 className="desc">Description</h1>
        <p>{jobDescription}</p>
      </div>

      <div className="bottom">
        <div className="bottom1">
          <div className="location-container margin">
            <MdLocationOn />
            <p className="location-text">{location}</p>
          </div>
          <div className="location-container">
            <BsBriefcaseFill />
            <p className="location-text">{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobCard

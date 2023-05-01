import {AiTwotoneStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsSearch, BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobItem = props => {
  const {eachJob} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachJob

  return (
    <li className="list-items">
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
        <p>{packagePerAnnum}</p>
      </div>
      <div>
        <hr className="hr-line1" />
      </div>
      <h1 className="desc">Description</h1>
      <p className="job-description">{jobDescription}</p>
    </li>
  )
}

export default JobItem

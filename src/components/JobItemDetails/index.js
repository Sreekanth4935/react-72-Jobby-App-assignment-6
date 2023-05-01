import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiTwotoneStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

class JobItemDetails extends Component {
  state = {
    eachJobDetails: {},
  }

  componentDidMount() {
    this.getEachJobDetails()
  }

  getEachJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id)

    const jwtToken = Cookies.get('jwt_token')
    // console.log('hwt', jwtToken)

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    // console.log(response)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const jobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: data.job_details.life_at_company,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        skills: data.job_details.skills.map(eachSkill => ({
          name: eachSkill.name,
          imageUrl: eachSkill.image_url,
        })),
        title: data.job_details.title,
      }
      //   console.log(jobDetails)
      const similarJobs = data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      //   console.log(similarJobs)
      this.setState({
        eachJobDetails: jobDetails,
        similarJobDetails: similarJobs,
      })
    } else {
      console.log('failure')
    }
  }

  render() {
    const {eachJobDetails, similarJobDetails} = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      skills,
      lifeAtCompany,
      title,
    } = eachJobDetails

    return (
      <div className="each-job-detail-container">
        <Header />
        <div className="job-details-card">
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
          <h1>Skills</h1>
        </div>
      </div>
    )
  }
}
export default JobItemDetails

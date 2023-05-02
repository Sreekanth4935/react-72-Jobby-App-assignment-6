import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiTwotoneStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FaExternalLinkAlt} from 'react-icons/fa'
import Header from '../Header'
import SimilarJobCard from '../SimilarJobCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  emptyJobs: 'EMPTY_JOBS',
}

class JobItemDetails extends Component {
  state = {
    eachJobDetails: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getEachJobDetails()
  }

  getEachJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    // console.log(response)

    if (response.ok) {
      const data = await response.json()

      const jobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        skills: data.job_details.skills.map(eachSkill => ({
          name: eachSkill.name,
          imageUrl: eachSkill.image_url,
        })),
        title: data.job_details.title,
      }

      const similarJobs = data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        eachJobDetails: jobDetails,
        similarJobDetails: similarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  JobItemDetailsSuccessApi = () => {
    const {eachJobDetails, similarJobDetails} = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      lifeAtCompany,
      title,
      skills,
    } = eachJobDetails

    return (
      <>
        <div className="first">
          <div className="each-job-detail-containers">
            <Header />

            <div className="job-details-card">
              <div className="top-one">
                <img
                  src={companyLogoUrl}
                  alt="job details company logo"
                  className="company-image"
                />
                <div className="second-one">
                  <h1 className="title test-heading">{title}</h1>
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
              <div className="link-container">
                <h1 className="desc">Description</h1>

                <div>
                  <a href={companyWebsiteUrl} className="link">
                    Visit
                  </a>
                  <FaExternalLinkAlt className="link-icon" />
                </div>
              </div>
              <p className="job-description">{jobDescription}</p>
              <h1 className="skills-heading">Skills</h1>
              {skills && (
                <ul className="ul-skills-container">
                  {skills.map(eachSkill => (
                    <li className="skills-li-elements" key={eachSkill.name}>
                      <img
                        className="skill-image"
                        src={eachSkill.imageUrl}
                        alt={eachSkill.name}
                      />
                      <h1 className="skills">{eachSkill.name}</h1>
                    </li>
                  ))}
                </ul>
              )}
              <h1 className="skills">Life at Company</h1>
              <div>
                {lifeAtCompany && (
                  <div className="life-at-company-container">
                    <p className="life-at-company-description">
                      {lifeAtCompany.description}
                    </p>
                    <div className="im-con">
                      <img
                        className="life-at-company-image"
                        src={lifeAtCompany.imageUrl}
                        alt="Life at Company"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="similar-card-container">
              <h1>Similar Jobs</h1>
              <ul className="ul-similar-jobs">
                {similarJobDetails &&
                  similarJobDetails.map(eachOne => (
                    <SimilarJobCard eachOne={eachOne} key={eachJobDetails.id} />
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    )
  }

  onClickRetryApi = () => {
    this.getEachJobDetails()
  }

  JobItemDetailsFailureApi = () => (
    <div className="failure-container">
      <Header />
      <div className="failure-image-container">
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className="failure-image"
          />
        </div>
        <h1 className="fail-head">Oops! Something Went Wrong</h1>
        <p className="fail-para">
          We cannot seem to find the page you are looking for.
        </p>
        <div>
          <button
            type="button"
            className="failure-button"
            onClick={this.onClickRetryApi}
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )

  profileDetailsInProgress = () => (
    <div data-testid="loader" className="failure-profile-details-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.profileDetailsInProgress()
      case apiStatusConstants.success:
        return this.JobItemDetailsSuccessApi()
      case apiStatusConstants.failure:
        return this.JobItemDetailsFailureApi()

      default:
        return null
    }
  }

  render() {
    return <>{this.renderJobDetails()}</>
  }
}
export default JobItemDetails

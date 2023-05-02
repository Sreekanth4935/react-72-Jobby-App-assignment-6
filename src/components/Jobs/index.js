import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import JobItem from '../JobItem'
import Header from '../Header'
import './index.css'
// import { each } from 'immer/dist/internal'

const initialEmploymentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
    isSelected: false,
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
    isSelected: false,
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
    isSelected: false,
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
    isSelected: false,
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  emptyJobs: 'EMPTY_JOBS',
}

class Jobs extends Component {
  state = {
    activeEmploymentLabelId: '',
    employmentTypesList: initialEmploymentTypesList,
    activeSalaryRadioId: '',
    searchInput: '',
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    jobItemsSuccessObject: {},
    profileDetailsSuccessObject: {},
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getJobsDetails = async () => {
    const {
      activeEmploymentLabelId,
      activeSalaryRadioId,
      searchInput,
    } = this.state

    const jwtToken = Cookies.get('jwt_token')

    this.setState({jobsApiStatus: apiStatusConstants.inProgress})

    const jobsApi = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentLabelId}&minimum_package=${activeSalaryRadioId}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(jobsApi, options)
    // console.log(response)
    if (response.ok) {
      const data = await response.json()
      //   console.log(data, 'data')
      const jobs = data.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      if (jobs.length === 0) {
        this.setState({
          jobsApiStatus: apiStatusConstants.emptyJobs,
        })
      } else {
        this.setState({
          jobItemsSuccessObject: jobs,
          jobsApiStatus: apiStatusConstants.success,
        })
      }
    } else {
      this.setState({
        jobsApiStatus: apiStatusConstants.failure,
      })
    }
  }

  jobsApiSuccessShow = () => {
    const {jobItemsSuccessObject} = this.state

    return (
      <div>
        <ul className="ul-container1">
          {jobItemsSuccessObject.map(eachJob => (
            <JobItem eachJob={eachJob} key={eachJob.id} />
          ))}
        </ul>
      </div>
    )
  }

  noJobsFound = () => (
    <div className="jobs-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="jobs-failure-view-image"
      />
      <h1 className="failure-text">No Jobs Found</h1>
      <p className="failure-text">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  onClickJobReset = () => {
    this.getJobsDetails()
  }

  jobsApiFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-view-image"
      />
      <h1 className="failure-text">Oops! Something Went Wrong</h1>
      <p className="failure-text">
        We cannot seem to find the page you are looking for
      </p>

      <button
        onClick={this.onClickJobReset}
        type="button"
        className="failure-retry-button"
      >
        Retry
      </button>
    </div>
  )

  onClickProfileReset = () => {
    this.getProfileDetails()
  }

  onChangeInputSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  updateSearchedValue = () => {
    const {searchInput} = this.state
    this.setState({searchInput}, this.getJobsDetails)
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    // console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const profileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileApiStatus: apiStatusConstants.success,
        profileDetailsSuccessObject: profileDetails,
      })
    }
    // else(profileDetailsSuccessObject === {})
    else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  profileDetailsSuccess = () => {
    const {profileDetailsSuccessObject} = this.state

    return (
      <>
        <div className="profile-details-container">
          <img
            className="profile-img"
            src={profileDetailsSuccessObject.profileImageUrl}
            alt="profile"
          />
          <h1 className="profile-name">{profileDetailsSuccessObject.name}</h1>
          <p className="bio">{profileDetailsSuccessObject.shortBio}</p>
        </div>
        <hr className="hr-line" />
      </>
    )
  }

  profileDetailsFailure = () => (
    <div className="failure-profile-details-container">
      <button
        type="button"
        className="failure-button"
        onClick={this.onClickProfileReset}
      >
        Retry
      </button>
    </div>
  )

  profileDetailsInProgress = () => (
    <div data-testid="loader" className="failure-profile-details-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  jobsApiInprogressView = () => (
    <div
      data-testid="loader"
      className="failure-profile-details-container to-center"
    >
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfileDetails = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.inProgress:
        return this.profileDetailsInProgress()
      case apiStatusConstants.success:
        return this.profileDetailsSuccess()
      case apiStatusConstants.failure:
        return this.profileDetailsFailure()
      default:
        return null
    }
  }

  renderJobItemDetails = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.jobsApiInprogressView()
      case apiStatusConstants.emptyJobs:
        return this.noJobsFound()
      case apiStatusConstants.success:
        return this.jobsApiSuccessShow()
      case apiStatusConstants.failure:
        return this.jobsApiFailureView()
      default:
        return null
    }
  }

  getActiveLabelInput = event => {
    // console.log(event.target.value)
    // console.log(event.target.type)
    // console.log(event.target.id)
    const {employmentTypesList} = this.state

    const updatedList = employmentTypesList.map(eachEmploy => {
      if (eachEmploy.employmentTypeId === event.target.id) {
        return {...eachEmploy, isSelected: !eachEmploy.isSelected}
      }
      return eachEmploy
    })

    const checkBoxFilter = updatedList.filter(eachEmployee => {
      if (eachEmployee.isSelected === true) {
        return eachEmployee.employmentTypeId
      }
      return null
    })

    const filterString = checkBoxFilter.map(
      eachEmploy => eachEmploy.employmentTypeId,
    )

    this.setState(
      {
        activeEmploymentLabelId: filterString.join(),
        employmentTypesList: updatedList,
      },
      this.getJobsDetails,
    )
  }

  getActiveRadioLabelId = event => {
    this.setState(
      {
        activeSalaryRadioId: event.target.id,
      },
      this.getJobsDetails,
    )
  }

  renderCheckboxEmployment = () => {
    const {employmentTypesList} = this.state
    return (
      <>
        <h1 className="employment-name">Type of Employment</h1>
        <ul className="ul-container">
          {employmentTypesList.map(eachLabel => (
            <li key={eachLabel.employmentTypeId}>
              <label htmlFor={eachLabel.employmentTypeId}>
                <input
                  className="label"
                  id={eachLabel.employmentTypeId}
                  type="checkbox"
                  default="checked"
                  onChange={this.getActiveLabelInput}
                />
                {eachLabel.label}
              </label>
            </li>
          ))}
        </ul>
        <hr className="hr-line" />
      </>
    )
  }

  renderRadioBoxSalary = () => {
    const {activeSalaryRadioId} = this.state
    return (
      <>
        <h1 className="employment-name">Salary Range</h1>
        <ul className="ul-container">
          {salaryRangesList.map(eachSalary => (
            <li key={eachSalary.salaryRangeId}>
              <label
                key={eachSalary.salaryRangeId}
                htmlFor={eachSalary.salaryRangeId}
              >
                <input
                  type="radio"
                  id={eachSalary.salaryRangeId}
                  className="label"
                  onChange={this.getActiveRadioLabelId}
                  checked={eachSalary.salaryRangeId === activeSalaryRadioId}
                />
                {eachSalary.label}
              </label>
            </li>
          ))}
        </ul>
      </>
    )
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="jobs-container">
        <Header />
        <div className="jobs-second-container">
          <div className="jobs-second-top">
            <div className="search-container">
              <input
                type="search"
                className="input-search-box"
                placeholder="Search"
                onChange={this.onChangeInputSearch}
                value={searchInput}
              />
              <BsSearch
                className="search-icon"
                onClick={this.updateSearchedValue}
              />
            </div>
            {this.renderProfileDetails()}
            {this.renderCheckboxEmployment()}
            {this.renderRadioBoxSalary()}
          </div>
          <div className="jobs-second-bottom">
            <div>
              <div className="search-container2">
                <input
                  type="search"
                  className="input-search-box2"
                  placeholder="Search"
                  onChange={this.onChangeInputSearch}
                  value={searchInput}
                />
                <BsSearch
                  data-testid="searchButton"
                  className="search-icon"
                  onClick={this.updateSearchedValue}
                />
              </div>
              {this.renderJobItemDetails()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs

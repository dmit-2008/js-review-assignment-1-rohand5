import "bootstrap/dist/css/bootstrap.min.css";
import { saveJob, getJobs, getSavedJobs, deletesavejob } from "./api/jobs";

let savedJobs = [];

async function fetchJobs(query = "") {
  try {
    const response = await fetch(`http://localhost:3000/jobs?q=${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const jobs = await response.json();
    return jobs;
  } catch (error) {
    alert("Failed to fetch jobs. Please try again.");
    return [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-jobs-form");
  searchForm.addEventListener("submit", handleSubmit);

  initializeJobs();
  setupTabs();
});

async function handleSubmit(e) {
  e.preventDefault();
  const query = document.getElementById("query-input").value.trim();

  // Ensure the query is not empty
  if (!query) {
    alert("Please enter a search query.");
    return;
  }

  const jobs = await fetchJobs(query);
  addJobsToDOM(jobs);
}

function addJobsToDOM(jobsJson) {
  const searchedJobsList = document.getElementById("searched-jobs");
  searchedJobsList.innerHTML = "";

  if (jobsJson.length === 0) {
    searchedJobsList.innerHTML =
      '<div class="text-dark">No Results Found</div>';
    alert("No jobs found for your search query.");
    return;
  }

  jobsJson.forEach((job) => {
    const newJob = document.createElement("li");
    newJob.classList.add("job-card", "card", "my-1");
    newJob.style.width = "18rem";

    newJob.innerHTML = `
            <div class="card-header">${job.company}</div>
            <div class="card-body">
                <h5 class="card-title">${job.title}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${
                  job.location
                }</h6>
                <h6 class="card-subtitle mb-2 text-body-secondary">Posted ${new Date(
                  job.date_posted
                ).toLocaleDateString()}</h6>
                <button class="btn btn-primary view-job-button" data-job-id="${
                  job.id
                }">View Job</button>
            </div>
        `;

    searchedJobsList.appendChild(newJob);

    const viewJobButton = newJob.querySelector(".view-job-button");
    viewJobButton.addEventListener("click", () => {
      viewJobDetails(job);
    });
  });
}

function addSavedJobsToDOM() {
  const searchedJobsList = document.getElementById("my-jobs");
  searchedJobsList.innerHTML = "";

  if (savedJobs.length === 0) {
    searchedJobsList.innerHTML =
      '<div class="text-dark">No saved results found</div>';
    return;
  }

  savedJobs.forEach((savedJob) => {
    const job = savedJob.job;
    const newJob = document.createElement("li");
    newJob.classList.add("job-card", "card", "my-1");
    newJob.style.width = "18rem";

    newJob.innerHTML = `
            <div class="card-header">${job.company}</div>
            <div class="card-body">
                <h5 class="card-title">${job.title}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${
                  job.location
                }</h6>
                <h6 class="card-subtitle mb-2 text-body-secondary">Posted ${new Date(
                  job.date_posted
                ).toLocaleDateString()}</h6>
                <button class="btn btn-primary view-job-button" data-job-id="${
                  job.id
                }">View Job</button>
            </div>
        `;

    searchedJobsList.appendChild(newJob);

    const viewJobButton = newJob.querySelector(".view-job-button");
    viewJobButton.addEventListener("click", () => {
      viewSavedJobDetails(savedJob.id, job);
    });
  });
}

async function saveJobToBookmarks(job) {
  const isAlreadySaved = savedJobs.some(
    (savedJob) => savedJob.jobId === job.id
  );
  if (isAlreadySaved) {
    alert("This job is already saved in My Bookmarked Jobs.");
    return;
  }

  try {
    await saveJob(job.id);
    displaySavedJobs();
  } catch (error) {
    console.error("Error saving job:", error);
    alert("Failed to save job. Please try again.");
  }
}

function viewJobDetails(job) {
  const jobDetailsCard = document.getElementById("job-details-card");

  jobDetailsCard.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h3 class="card-title">${job.title}</h3>
                <h4 class="card-subtitle mb-2 text-body-secondary pb-3">${
                  job.company
                }</h4>
                <h6 class="card-subtitle mb-2 text-body-secondary">${
                  job.location
                }</h6>
                <h6 class="card-subtitle mb-2 text-body-secondary pb-3">Posted ${new Date(
                  job.date_posted
                ).toLocaleDateString()}</h6>
                <h5 class="card-subtitle mb-2">Description</h5>
                <p class="card-text">${job.description}</p>
                <h5 class="card-subtitle mb-2">Qualifications</h5>
                <p class="card-text">${job.qualifications}</p>

                <button class="btn btn-success save-job" data-job-id="${
                  job.id
                }">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmarks" viewBox="0 0 16 16">
  <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1z"/>
  <path d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1"/>
</svg> Save Job
                </button>
            </div>
        </div>
    `;

  const saveJobButton = jobDetailsCard.querySelector(".save-job");
  saveJobButton.addEventListener("click", () => {
    saveJobToBookmarks(job);
  });
}

function viewSavedJobDetails(id, job) {
  const jobDetailsCard = document.getElementById("job-details-card2");

  jobDetailsCard.innerHTML = `
  <div class="card">
      <div class="card-body">
          <h3 class="card-title">${job.title}</h3>
          <h4 class="card-subtitle mb-2 text-body-secondary pb-3">${
            job.company
          }</h4>
          <h6 class="card-subtitle mb-2 text-body-secondary">${
            job.location
          }</h6>
          <h6 class="card-subtitle mb-2 text-body-secondary pb-3">Posted ${new Date(
            job.date_posted
          ).toLocaleDateString()}</h6>
          <h5 class="card-subtitle mb-2">Description</h5>
          <p class="card-text">${job.description}</p>
          <h5 class="card-subtitle mb-2">Qualifications</h5>
          <p class="card-text">${job.qualifications}</p>

          <button class="btn btn-danger delete-job" data-job-id="${job.id}">
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg> Delete Job
          </button>
      </div>
  </div>
`;

  const deleteJobButton = jobDetailsCard.querySelector(".delete-job");
  deleteJobButton.addEventListener("click", async () => {
    try {
      const result = await deletesavejob(id);
      if (result) {
        displaySavedJobs();
        jobDetailsCard.innerHTML = "";
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete saved job. Please try again.");
    }
  });
}

async function displaySavedJobs() {
  savedJobs = await getSavedJobs();
  addSavedJobsToDOM();
}

function setupTabs() {
  document
    .getElementById("jobs-tab-navigation")
    .addEventListener("click", (e) => {
      const targetTab = e.target;

      if (targetTab && targetTab.classList.contains("nav-link")) {
        const isSavedJobsTab =
          targetTab.textContent.includes("My Bookmarked Jobs");

        document
          .getElementById("search-jobs-tab")
          .classList.toggle("d-none", isSavedJobsTab);
        document
          .getElementById("my-jobs-tab")
          .classList.toggle("d-none", !isSavedJobsTab);

        const tabs = document.querySelectorAll(".nav-link");
        tabs.forEach((tab) => {
          tab.classList.remove("active");
        });
        targetTab.classList.add("active");

        if (isSavedJobsTab) {
          displaySavedJobs();
        }
      }
    });
}

async function initializeJobs() {
  const jobs = await getJobs();
  addJobsToDOM(jobs);
  displaySavedJobs();
}

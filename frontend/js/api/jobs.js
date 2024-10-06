// Function to fetch jobs based on a search query
export async function getJobs(query = "") {
    try {
        console.log("Fetching jobs for query:", query);
        const response = await fetch(`http://localhost:3000/jobs?q=${query}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jobs = await response.json();
        return jobs;
    } catch (error) {
        console.error("Error fetching jobs:", error);
        alert("Failed to fetch jobs. Please try again.");
        return [];
    }
}

// Function to save a job by its ID
export async function saveJob(jobId) {
    try {
        console.log('Saving job with ID:', jobId);
        
        const response = await fetch(`http://localhost:3000/saved-jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jobId })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const savedJob = await response.json();
        return savedJob;
    } catch (error) {
        console.error('Error saving job:', error);
    }
}


// Function to fetch saved jobs
export async function getSavedJobs() {
    try {
        console.log('Fetching saved jobs');
        const response = await fetch(`http://localhost:3000/saved-jobs`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const savedJobs = await response.json();
        return savedJobs;
    } catch (error) {
        console.error('Error fetching saved jobs:', error);
    }
}


// Function to delete a saved job
export async function deletesavejob(Id) {
    try {
        const response = await fetch(`http://localhost:3000/saved-jobs/${Id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error("Failed to delete job. Response:", errorDetails);
            throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorDetails}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting saved job:", error);
        throw error;
    }
}

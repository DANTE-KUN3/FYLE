// script.js
$(document).ready(function () {
    const apiurl = "https://api.github.com/users";
    const main = $("#main");
    const userContainer = $("#user-container");
    const reposContainer = $("#repos-container");
    const paginationContainer = $("#pagination-container");
    const resultsPerPage = 1;
    let currentPage = 1;
    let totalPages = 0;

    const token = "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"; // Replace with your actual GitHub access token

    const getUser = async () => {
        const offset = Math.floor(Math.random() * 100000);
        const response = await fetch(`${apiurl}?per_page=${resultsPerPage}&page=${currentPage}&since=${offset}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const userData = await response.json();

        if (userData.length > 0) {
            const user = userData[0];
            displayUser(user);
            displayRepos(user.login);
            displayPagination();
        }
    }

    const displayUser = (user) => {
        console.log(user);
    
        userContainer.html(`
            <img src="${user.avatar_url}" alt="User Avatar" id="user-avatar">
            <h2 id="user-login">${user.login}</h2>
            <p id="user-location">${user.location || 'Location not available'}</p>
            <p id="user-bio">${user.bio || 'No bio available'}</p>
            <p id="user-github"><a href="${user.html_url}" target="_blank">${user.html_url}</a></p>
        `);
    }
    
    
    

    const displayRepos = async (username) => {
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=10`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const reposData = await response.json();

        reposContainer.html("");
        reposData.forEach(repo => {
            const repoCard = $(`<div class="repo-card">
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available'}</p>
            </div>`);
            reposContainer.append(repoCard);
        });
    }

    const displayPagination = () => {
        paginationContainer.html("");
    
        totalPages = 100; // Total number of pages
    
        // Previous button
        const prevButton = $(`<button class="pagination-button">Previous</button>`);
        prevButton.on("click", () => {
            if (currentPage > 1) {
                currentPage--;
                updatePaginationButtons();
                getUser();
            }
        });
        paginationContainer.append(prevButton);
    
        // Page buttons
        for (let i = calculateStartPage(); i <= calculateEndPage(); i++) {
            const button = $(`<button class="pagination-button">${i}</button>`);
            if (i === currentPage) {
                button.addClass("active-page");
            }
            button.on("click", () => {
                currentPage = i;
                console.log(`Clicked on page ${i}`);
                updatePaginationButtons();
                getUser();
            });
            paginationContainer.append(button);
        }
    
        // Next button
        const nextButton = $(`<button class="pagination-button">Next</button>`);
        nextButton.on("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePaginationButtons();
                getUser();
            }
        });
        paginationContainer.append(nextButton);
    }
    
    const calculateStartPage = () => {
        return Math.max(1, currentPage - 4);
    }
    
    const calculateEndPage = () => {
        return Math.min(totalPages, currentPage + 5);
    }
    
    const updatePaginationButtons = () => {
        displayPagination();
    }
    

    getUser();
});

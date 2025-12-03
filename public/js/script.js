let authorLinks = document.querySelectorAll("a");
for (authorLink of authorLinks) {
    authorLink.addEventListener("click", getAuthorInfo);
}

async function getAuthorInfo() {
    var myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();
    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    let authorName = document.querySelector("#authorName");
    let authorInfo = document.querySelector("#authorInfo");
    let authorBio = document.querySelector("#authorBio");
    let authorImg = document.querySelector("#authorImg");
    let dob = data[0].dob.substring(0, 10);
    let dod = data[0].dod ? data[0].dod.substring(0, 10) : 'Present';
    authorName.innerHTML = `<h1> ${data[0].firstName} ${data[0].lastName} </h1>`;
    authorInfo.innerHTML = `<strong>DOB:</strong> <time>${dob}</time> <strong>DOD:</strong> <time> ${dod}</time> 
    <strong>Sex:</strong> ${data[0].sex} <br><strong>Profession: </strong> ${data[0].profession}
    <strong>Country: </strong> ${data[0].country} <br> `;
    authorBio.innerHTML = `<strong>Biography:</strong> <br>${data[0].biography}<br>`;
    authorImg.innerHTML = `<img src="${data[0].portrait}" width="200"><br>`;
}
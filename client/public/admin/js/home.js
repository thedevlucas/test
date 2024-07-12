for (let x of users)
{
    let html = 
    `<tr>
        <td>${x.id}</td>
        <td>${x.username}</td>
        <td>${x.course}</td>
    </tr>`

    document.getElementById("users").insertAdjacentHTML('beforeend', html);
}
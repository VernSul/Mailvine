function upload() {
    fetch("/upload", { 
        method: "GET",
    }).then(data => data.json())
    .then(response => console.log(response.data))
}

function single() {
    fetch("/single", { 
        method: "POST",
        headers: {
            'Accept': 'application/json',   
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({first: document.getElementById('firstName').value.toLowerCase(),
                              last: document.getElementById('lastName').value.toLowerCase(),
                              domain: document.getElementById('domain').value.toLowerCase() 
                            })
    }).then(data => {
        console.log(data);
        return data.json()})
    .then(response => document.getElementById('response').textContent = response)

}



async function compileName () {
    const first = document.getElementById('firstName').value.toLowerCase();
    const last = document.getElementById('lastName').value.toLowerCase();
    const domain = document.getElementById('domain').value.toLowerCase();
    const comb = [];
    let response;
    // let response = [];
    comb.push(first[0]+last);
    comb.push(first);
    comb.push(first+'.'+last);
    comb.push(first+last);


    let name = first+ ' ' + last;

        await fetch('https://api.hunter.io/v2/email-finder?domain='+domain+'&first_name='+first+'&last_name='+last+'&api_key=1fc2f3f08ab025da0bd8362708f44f130e262ada', {
            method: "GET"
        })
        .then(data => data = data.json())
        .then(data => {
            console.log(data.data.email)
            response = data.data.email;
       
        })


    document.getElementById('response').textContent = response;
    console.log(response);
}

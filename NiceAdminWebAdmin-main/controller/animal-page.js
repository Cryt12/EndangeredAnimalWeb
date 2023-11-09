const supabaseUrl  = 'https://rbnketmcgwygdvxxfovh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmtldG1jZ3d5Z2R2eHhmb3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY5MjQ4NDEsImV4cCI6MjAxMjUwMDg0MX0.Qr0iZFfVsfNCyoQcU3hBiVkQ6ULCSMRiAwY8CxKrIeU';
var supabase = supabase.createClient(supabaseUrl,supabaseAnonKey);

var animalList = [];


async function loadAnimals() {
    let { data: animals, error } = await supabase
    .from('animals')
    .select('*');
    console.log(animals);
    animalList = animals;                  
    var temp = ''
    for (let i = 0; i < animalList.length; i++) {
    temp += "<tr>";
    temp += "<th><img src=" + "https://www.iucn.org/sites/default/files/content/images/2021/african_savanna_elephant_annabel_wynyard.jpeghttps://www.iucn.org/sites/default/files/content/images/2021/african_savanna_elephant_annabel_wynyard.jpeg" + "alt=''></th>";
    temp += "<td><strong>" + animalList[i]['animal_name'] + "</strong></td>";
    temp += "<td>" + animalList[i]['animal_description'] + "</td>";
    temp += "<td><button onclick='editAnimal(" + i + ")' class='rounded-button'>Edit</button></td>"
    temp += "<td><button onclick='deleteAnimal(" + i + ")' class='rounded-button'>Delete</button></td></tr>"

    }
    document.getElementById('animalListContainer').innerHTML = temp;                     
}

async function deleteAnimal(index) {   
        console.log(index);
        console.log("Called delete");

    }
async function editAnimal(index) {    
        console.log(index);
        console.log("Called edit");
   }



async function initState() {
    var username = localStorage.getItem('username')
    var password = localStorage.getItem('password')

    if(username === null || password === null){
        window.location.href = 'pages-login.html';
    }else{
        loadAnimals();
    }
}
                  
                    

window.onload = initState;
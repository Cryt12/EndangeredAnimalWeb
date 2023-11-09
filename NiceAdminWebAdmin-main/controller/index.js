var reportMarkerList = []
const supabaseUrl  = 'https://rbnketmcgwygdvxxfovh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmtldG1jZ3d5Z2R2eHhmb3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY5MjQ4NDEsImV4cCI6MjAxMjUwMDg0MX0.Qr0iZFfVsfNCyoQcU3hBiVkQ6ULCSMRiAwY8CxKrIeU';
var supabase = supabase.createClient(supabaseUrl,supabaseAnonKey);

var map;    
var infoWindowList = [];
var markerList = [];

async function loadData()  {
    let { data: report, error } = await supabase
    .from('reports')
    .select('*');
    reportMarkerList = report
}

async function initMap() {
    await loadData()
    const { Map } = await  google.maps.importLibrary("maps");
    const { Marker } = await google.maps.importLibrary("marker");
    if (localStorage.getItem('latitude') === null && localStorage.getItem('longitude') === null) {
        await navigator.geolocation.getCurrentPosition(showPosition);
    }
    function showPosition(position) {
        localStorage.setItem('latitude',position.coords.latitude )
        localStorage.setItem('longitude',position.coords.longitude )
    }
    map = new Map(document.getElementById("map"), {
            fullscreenControl: false,
            streetViewControl: false,
            disableDefaultUI: true,
            center: { lat:  parseFloat(localStorage.getItem('latitude')), lng: parseFloat(localStorage.getItem('longitude')) },
            zoom: 8.15,
            
    });
    
    for (let index = 0; index < reportMarkerList.length; index++) {
        console.log(reportMarkerList[index]['latitude'])
        console.log(reportMarkerList[index]['longitude'])

        let marker = new google.maps.Marker({
            position: { lat: reportMarkerList[index]['latitude'], lng: reportMarkerList[index]['longitude'] },
            map: map,
            title: "Marker Title",
            optimized: false,
            
        }); 

        let infoWindow = new google.maps.InfoWindow({
        content: '<div><img src='+ reportMarkerList[index]['animal_imageUrl'] + ' alt="Info Window Image" width="50" height="50"></div>'
        });
        markerList.push(marker);
        infoWindowList.push(infoWindow);
        infoWindow.open(map, marker);
        marker.addListener("click", (function (marker, infoWindow) {
        return function () {
            infoWindow.open(map, marker);
        };
        })(marker, infoWindow));
    }
}

var reportList = [];

function closeAllInfoWindow() {
    for (let index = 0; index < infoWindowList.length; index++) {
        infoWindowList[index].close();
        
    }
}

function removeAllMarkers() {
    for (var i = 0; i < markerList.length; i++) {
        markerList[i].setMap(null);
    }
}

async function handleRowClick(index) {                   
    var clickedRowData = reportList[index];
   
    var newLatLng = new google.maps.LatLng(clickedRowData['latitude'], clickedRowData['longitude']);
    map.setCenter(newLatLng);
    var mapSection = document.getElementById('map');
    mapSection.scrollIntoView({ behavior: 'smooth' });
    let marker = new google.maps.Marker({
        position: { lat: clickedRowData['latitude'], lng: clickedRowData['longitude'] },
        map: map,
        title: "Marker Title",
        optimized: false,
        
    });
    await closeAllInfoWindow()
    await removeAllMarkers();

    let infoWindow = new google.maps.InfoWindow({
    content: '<div><img src='+ clickedRowData['animal_imageUrl'] + ' alt="Info Window Image" width="50" height="50"></div>'
    });
    infoWindowList.push(infoWindow);
    markerList.push(marker);

    infoWindow.open(map, marker);
    marker.addListener("click", (function (marker, infoWindow) {
    return function () {
        infoWindow.open(map, marker);
    };
    })(marker, infoWindow));
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
        });
}
                  
async function loadReport() {
    let { data: report, error } = await supabase
    .from('reports')
    .select('*, animals:animals(*)')
    
    reportList = report;                  
    var temp = ''
    for (let i = 0; i < reportList.length; i++) {
    temp += "<tr onclick='handleRowClick(" + i + ")'>";
    temp += "<th scope='row'><img src=" + reportList[i]['animal_imageUrl'] + "alt=''></th>";
    temp += "<td><strong>" + reportList[i]['animals']['animal_name'] + "</strong></td>";
    temp += "<td>" + reportList[i]['animals']['animal_description'] + "</td>";
    temp += "<td><button class='rounded-button'>Navigate</button></td></tr>"
    }
    document.getElementById('reportContainer').innerHTML = temp;                     
}

async function initState() {
    var username = localStorage.getItem('username')
    var password = localStorage.getItem('password')

    if(username === null || password === null){
        window.location.href = 'pages-login.html';
    }else{
        await initMap();
        loadReport();
    }
}
                  
                    

window.onload = initState;
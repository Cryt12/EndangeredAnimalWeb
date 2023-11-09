const supabaseUrl  = 'https://rbnketmcgwygdvxxfovh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmtldG1jZ3d5Z2R2eHhmb3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY5MjQ4NDEsImV4cCI6MjAxMjUwMDg0MX0.Qr0iZFfVsfNCyoQcU3hBiVkQ6ULCSMRiAwY8CxKrIeU';
var supabase = supabase.createClient(supabaseUrl,supabaseAnonKey);

async function login() {
    document.getElementById("login-form").addEventListener("submit", async function(event)  {
        event.preventDefault(); // Prevent form submission
        var username = document.getElementById("yourUsername").value;
        var password = document.getElementById("yourPassword").value;
        let { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password);
        console.log(users)
        if(users.length > 0){
            window.location.href = "index.html";
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        }else{
            alert("Invalid username or password");
        }
    });

}

async function initState() {
    var username = localStorage.getItem('username')
    var password = localStorage.getItem('password')

    if(username === null || password === null){
    }else{
        window.location.href = 'index.html';
    }
}
                  
window.onload = initState;
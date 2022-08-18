async function getWeatherFromAPI(lat,lon){
    const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=1825054a3f2ae5db2186b167318fb06c`);
    const weatherObj= await response.json();
    return weatherObj;
}
async function cleanData(lat,lon){
    const apiData= await getWeatherFromAPI(lat,lon);
    /**
     * main temp
     * clouds description
     * high/low
     * Humidity
     * pressure
     * visibility
     * wind
     */
    let cleanWObj={main:{},cloud:{}};
    //main
    cleanWObj.main.temp=apiData.main.temp;
    cleanWObj.main.feels_like=apiData.main.feels_like;
    cleanWObj.main.temp_max=apiData.main.temp_max;
    cleanWObj.main.temp_min=apiData.main.temp_min;
    //cloud desc
    cleanWObj.cloud.desc=apiData.weather[0].description;
    cleanWObj.cloud.icon=apiData.weather[0].icon;
    //humidity pressure
    cleanWObj.humidity=apiData.main.humidity;
    cleanWObj.pressure=apiData.main.pressure;
    //visibility wind speed
    cleanWObj.visibility=apiData.visibility*0.001;
    cleanWObj.wind=apiData.wind.speed*(18/5);
    return cleanWObj;
}
async function getIp(){
    const response= await fetch(`https://json.geoiplookup.io/`);
    const locationObj= await response.json();
    return locationObj;
}
async function getLocationFormAPI(loc){
    const response= await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${loc}&limit=3&appid=1825054a3f2ae5db2186b167318fb06c`);
    const locationObj= await response.json();
    return locationObj;
}
async function showLocation(loc){
    let apiData,
        apiString,
        searchElem;
    if(loc!=""){
        apiData=await getLocationFormAPI(loc);
        clearResults();
        apiData.forEach(elem => {
            apiString=elem.name+","+elem.country;
            searchElem=searchResultsDOM(apiString,elem.lat,elem.lon);
            searchResultsEvent(searchElem);
        });
    } 
}
function searchResultsEvent(elem){
    const lat=elem.dataset.lat;
    const lon=elem.dataset.lon;
    console.log(lat,lon);
    elem.addEventListener("click",()=>{
        cleanData(lat,lon);
    });
}
function clearResults(){
    const searchMenu=document.querySelectorAll(".searchMenu div");
    searchMenu.forEach(element => {
        element.parentElement.removeChild(element);
    });
}
function searchResultsDOM(tContent,lat,lon){
    const searchMenu=document.querySelector(".searchMenu");
    const results=document.createElement("div");
    results.className="searchR";
    results.dataset.lat=lat;
    results.dataset.lon=lon;
    results.textContent=tContent;
    searchMenu.appendChild(results);
    return results;
}
function events(){
    //show search results from api
    const inputLocation=document.getElementById("location");
    let timeout;
    inputLocation.addEventListener("input",(e)=>{
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            showLocation(e.target.value);
        }, "1000")
        
    });
    //show search menu
    inputLocation.addEventListener("click",()=>{
        const searchMenu=document.querySelector(".searchMenu");
        searchMenu.classList.remove("searchHidden");
    });
    //close search menu
    document.body.addEventListener("click",(e)=>{
        const searchMenu=document.querySelector(".searchMenu");
        if(e.target.className!="searchMenu" && e.target.id!="location"){
            searchMenu.classList.add("searchHidden");
        }
    });
}
/*(async function main(){
    //create events
    events();
    //get weather of current location from ip
    const currentLoc=await getIp();
    const currentWeather=await cleanData(currentLoc.latitude,currentLoc.longitude);
    
    console.log(currentLoc);
    console.log(currentWeather);


})();*/
async function getWeatherFromAPI(lat,lon){
    const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=1825054a3f2ae5db2186b167318fb06c`);
    const weatherObj= await response.json();
    return weatherObj;
}
async function cleanData(lat,lon){
    const apiData= await getWeatherFromAPI(lat,lon);
    let cleanWObj={main:{},cloud:{},location:{}};
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
    cleanWObj.wind=Math.round(apiData.wind.speed*(18/5));
    //location
    cleanWObj.location.name=apiData.name;
    cleanWObj.location.country=apiData.sys.country;
    return cleanWObj;
}
async function getIp(){
    const response= await fetch(`https://json.geoiplookup.io/`);
    const locationObj= await response.json();
    return locationObj;
}
async function getLocationFormAPI(loc){
    const response= await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${loc}&limit=3&appid=1825054a3f2ae5db2186b167318fb06c`);
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
    appendClickEvent(results);
    return results;
}
function appendClickEvent(elem){
    elem.addEventListener("click", async ()=>{
        const currentWeather=await cleanData(elem.dataset.lat,elem.dataset.lon);
        fillSiteWithData(currentWeather);
    });
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
    //change temperature
    const temp=document.querySelector(".temperature");
    let userTemp = localStorage.getItem("temp");
    temp.addEventListener("click",(e)=>{
        if(e.target.className=="c"){
            userTemp=0;
            temp.firstChild.setAttribute("style","color: #81a4c2;");
            temp.lastChild.setAttribute("style","color: aliceblue");
            localStorage.setItem("temp", JSON.stringify(userTemp));
            changeTemperatureText();
        }else if(e.target.className=="f"){
            userTemp=1;
            temp.lastChild.setAttribute("style","color: #81a4c2;");
            temp.firstChild.setAttribute("style","color: aliceblue");
            localStorage.setItem("temp", JSON.stringify(userTemp));
            changeTemperatureText();
        }
    });
}
function changeTemperatureText(){
    //select temp doms
    const temp=document.querySelector(".temp");
    const feelsLike=document.querySelector(".feelsLike");
    const lowHigh=document.querySelector(".lowHigh");
    //change temp based on user preference 
    const userTemp=localStorage.getItem("temp");
    let tempScale,mainTemp,tempMax,tempMin,tempFeelLike;
    if(userTemp==0){
        tempScale="°C";
        mainTemp=toCel(temp.dataset.temp);
        tempMax=toCel(lowHigh.dataset.tempMax);
        tempMin=toCel(lowHigh.dataset.tempMin);
        tempFeelLike=toCel(feelsLike.dataset.feelsLike);
    }else if(userTemp==1){
        tempScale="°F";
        mainTemp=toFah(temp.dataset.temp);
        tempMax=toFah(lowHigh.dataset.tempMax);
        tempMin=toFah(lowHigh.dataset.tempMin);
        tempFeelLike=toFah(feelsLike.dataset.feelsLike);
    }
    //apply changes
    temp.textContent=`${mainTemp+tempScale}`;
    temp.dataset.temp=`${mainTemp}`;

    feelsLike.textContent=`Feels Like: ${tempFeelLike+tempScale}`;
    feelsLike.dataset.feelsLike=`${tempFeelLike}`;

    lowHigh.textContent=`High/Low: ${tempMax}°/${tempMin}°`;
    lowHigh.dataset.tempMax=`${tempMax}`;
    lowHigh.dataset.tempMin=`${tempMin}`;

}
function toCel(temp){
    return Math.round((temp - 32) * 5/9);
}
function toFah(temp){
    return Math.round(temp * (9/5) + 32);
}
function fillSiteWithData(weatherObj){
    const userTemp=localStorage.getItem("temp");
    let tempScale,mainTemp,tempMax,tempMin,tempFeelLike;
    if(userTemp==0){
        tempScale="°C";
        mainTemp=Math.round(weatherObj.main.temp);
        tempMax=Math.round(weatherObj.main.temp_max);
        tempMin=Math.round(weatherObj.main.temp_min);
        tempFeelLike=Math.round(weatherObj.main.feels_like);
    }else if(userTemp==1){
        tempScale="°F";
        mainTemp=toFah(weatherObj.main.temp);
        tempMax=toFah(weatherObj.main.temp_max);
        tempMin=toFah(weatherObj.main.temp_min);
        tempFeelLike=toFah(weatherObj.main.feels_like);
    }
    document.body.setAttribute("style",`background-image: url(images/${weatherObj.cloud.icon}.jpg)`)
    const img=document.querySelector(".weatherIcon img");
    img.setAttribute("width","150px");
    img.setAttribute("height","150px");
    const temp=document.querySelector(".temp");
    const city=document.querySelector(".city");
    const con=document.querySelector(".weatherCon");
    const hum=document.querySelector(".humidity");
    const feelsLike=document.querySelector(".feelsLike");
    const press=document.querySelector(".pressure");
    const wind=document.querySelector(".wind");
    const visi=document.querySelector(".visibility");
    const lowHigh=document.querySelector(".lowHigh");

    img.src=`icons/${weatherObj.cloud.icon}.svg`;
    temp.textContent=`${mainTemp+tempScale}`;
    temp.dataset.temp=`${mainTemp}`;

    city.textContent=`${weatherObj.location.name}, ${weatherObj.location.country}`;
    con.textContent=`${weatherObj.cloud.desc}`;
    hum.textContent=`Humidity: ${weatherObj.humidity}%`;
    feelsLike.textContent=`Feels Like: ${tempFeelLike+tempScale}`;
    feelsLike.dataset.feelsLike=`${tempFeelLike}`;
    press.textContent=`Pressure: ${weatherObj.pressure} hPa`;
    wind.textContent=`Wind: ${weatherObj.wind} km/h`;
    visi.textContent=`Visibility: ${weatherObj.visibility} km`;
    lowHigh.textContent=`High/Low: ${tempMax}°/${tempMin}°`;
    lowHigh.dataset.tempMax=`${tempMax}`;
    lowHigh.dataset.tempMin=`${tempMin}`;
}
function createLocalStorage() {
    let check = localStorage.getItem("temp");
    if (check === null) {
        //default 0 is °C & 1 is °F
        let temp=0;
        localStorage.setItem("temp", JSON.stringify(temp));
    }
}
function selectTemp(){
    let temp = localStorage.getItem("temp");
    const tempDiv=document.querySelector(".temperature");
    if(temp==0){
        tempDiv.firstChild.setAttribute("style","color: #81a4c2;");
        tempDiv.lastChild.setAttribute("style","color: aliceblue");
    }else if(temp==1){
        tempDiv.lastChild.setAttribute("style","color: #81a4c2;");
        tempDiv.firstChild.setAttribute("style","color: aliceblue");
    }
}
(async function main(){
    //create events
    createLocalStorage();
    selectTemp();
    events();
    //get weather of current location from ip
    const currentLoc=await getIp();
    const currentWeather=await cleanData(currentLoc.latitude,currentLoc.longitude);
    fillSiteWithData(currentWeather);



})();
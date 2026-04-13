
inlets = 1;
outlets = 1;

let biomassDB = new Global("biomassDB");


function get(type, subtype)
{
    
    if (type == "ecosystems") {
        let ecos = Object.keys(biomassDB.ecosystems);
        outlet(0, "ecosystems", ecos);
        if (subtype in biomassDB.ecosystems) {
            let timesOfDay = biomassDB.ecosystems[subtype].files.map(item => item.time_of_day);
            outlet(0, "timesOfDay", timesOfDay);
        }
    }
    if (type == "weather") {
        outlet(0, "weather", biomassDB.ecosystems[timeOfDay]);
    }

}

function getFile(type="ecosystem", subtype, timeOfDay) {
    post("getFile", type, subtype, timeOfDay, "\n");

    if (type == "ecosystem" && subtype in biomassDB.ecosystems && timeOfDay) {
        let fileObj = biomassDB.ecosystems[subtype].files.find(item => item.time_of_day === timeOfDay);
        post(fileObj.filename, "\n");
        outlet(0, "file", fileObj.filename);
    } else {
        post(subtype, subtype in biomassDB.ecosystems);
        post(biomassDB.ecosystems[subtype].files.find(item => item.time_of_day === timeOfDay));
        post(biomassDB.ecosystems[subtype].files.map(item => item.time_of_day),"\n");
        post(timeOfDay in biomassDB.ecosystems[subtype].files.map(item => item.time_of_day),"\n");
    }
}

function bang()
{

	
}

function load(file="welikia.json") {
    post("Loading " + file);
    
    /*
    fetch('welikia.json')
    .then(response => response.json()) // Parse JSON
    .then(data => {
        welikia = data;
        post(data);
    }) // Work with JSON data
    .catch(error => post('Error fetching JSON:', error));
    */
    
    
    var f = new File(file, "readwrite");
    post(f.isopen); // true, if myfile.txt is in the Max search path
    post(f.filename);
    post(f.eof);
    
    let welikiaChars = f.readchars(f.eof);
    let welikiaString = welikiaChars.join('');
    post((typeof welikiaString), "\n", welikiaString);
    
    try {
        biomassDB.db = JSON.parse(welikiaString);
        // Process parsedData
    } catch (e) {
        post("JSON parsing error:", e, "\n");
        post("Problematic database schema:", welikiaString, "\n");
    }

    f.close();
    

    post("database loaded", biomassDB.title), "\n" );
    post(biomassDB.title, biomassDB.ecosystems.forest.label);
    outlet(0, "database", file);
}


function init() {
    try {
          if (biomassDB.title) {
              post('Sound database loaded.')
          } else {
              load();
          }
        }
    catch {
        post('Sound database failed.')
    }
        
}

init();



inlets = 1;
outlets = 1;

let welikia = new Global("welikia");


function get(type, subtype)
{
    
    if (type == "ecosystems") {
        let ecos = Object.keys(welikia.db.ecosystems);
        outlet(0, "ecosystems", ecos);
        if (subtype in welikia.db.ecosystems) {
            let timesOfDay = welikia.db.ecosystems[subtype].files.map(item => item.time_of_day);
            outlet(0, "timesOfDay", timesOfDay);
        }
    }
    if (type == "weather") {
        outlet(0, "weather", welikia.db.ecosystems[timeOfDay]);
    }

}

function getFile(type="ecosystem", subtype, timeOfDay) {
    post("getFile", type, subtype, timeOfDay, "\n");

    if (type == "ecosystem" && subtype in welikia.db.ecosystems && timeOfDay) {
        let fileObj = welikia.db.ecosystems[subtype].files.find(item => item.time_of_day === timeOfDay);
        post(fileObj.file, "\n");
        outlet(0, "file", fileObj.file);
    } else {
        post(subtype, subtype in welikia.db.ecosystems);
        post(welikia.db.ecosystems[subtype].files.find(item => item.time_of_day === timeOfDay));
        post(welikia.db.ecosystems[subtype].files.map(item => item.time_of_day),"\n");
        post(timeOfDay in welikia.db.ecosystems[subtype].files.map(item => item.time_of_day),"\n");
    }
}

function bang()
{
	// basic_getting_and_setting();
	// importing_and_exporting();
	
    
    
	// additional functions available for dict:
	
	// x.clone("ark");
	// x.remove("pig");
	// x.clear();
	
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
        welikia.db = JSON.parse(welikiaString);
        // Process parsedData
    } catch (e) {
        post("JSON parsing error:", e, "\n");
        post("Problematic database schema:", welikiaString, "\n");
    }

    f.close();
    

    post("database loaded", (typeof welikia));
    post(welikia.db.title, welikia.db.ecosystems.forest.label);
    outlet(0, "database", file);
}


function init() {
    try {
          if (welikia.db.title) {
              post('Welikia Sound database loaded.')
          } else {
              load();
          }
        }
    catch {
        post('Welikia Sound database failed.')
    }
        
}

init();


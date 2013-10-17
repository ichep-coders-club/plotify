<!--

////////////////////////////////////////////////////////////////////////////////////////////////
// 
// Image class
// 
////////////////////////////////////////////////////////////////////////////////////////////////
function Image(name,alt,parameter_dependency,display_extension,download_extension){
// name (string): The name of the parameter which is used in html tag IDs.
// alt (string): The alt text used by the picture on mouseover and if the image can't be found.
// parameter_dependency (Array of strings and Parameters):
//          A list used to build the filenames for the images.  Every Parameter in the list is replaced by the
//          filename segment for it's current value and then all strings are concatanated in the order 
//          provided in this argument.
// display_extension (string): File extension of the images on the webpage
// download_extension [optional] (string): File extension of the images that download when clicked. 
//          If ommitted, the value of 'display_extension' is used.
    //----------------- Data members -----------------//
    this.Name=name;
    this.Title=alt;
    this.Dependencies=parameter_dependency;
    this.DisplayExt=display_extension;
    this.DownloadExt=typeof download_extension!== 'undefined' ?download_extension:this.DisplayExt;

    this.DisplayID=this.Name+"_pic";
    this.DownloadID=this.Name+"_file";

    //----------------- writeHtml method -----------------//
    // Function to write the Html code for the image
    this.writeHtml=function(cssClass,DivID){
        var html="<a id="+this.DownloadID+" >\n";
        if(cssClass) html+=" <img class='"+cssClass+"'";
        else html+=" <img class='plot'";
        html+=" id='"+this.DisplayID+"'";
        html+=" alt='"+this.Title+"'";
        html+=" title='"+this.Title+"'";
        html+="/></a>";

        // Define the target for the parameter table.
        // If DivID is supplied, use that, else use the parameter's name as the ID of the block.
        var target_div=typeof DivID !=='undefined' ? DivID: this.Name;

        // Place html for the parameter table into the parameter's div
        var section=document.getElementById(target_div);
        if(!section) {
            alert("Unable to find div with ID:"+ target_div+ " in Image.writeHtml")
                return;
        }
        section.innerHTML+=html;
    }

    //----------------- update method -----------------//
    // Function to update the image
    this.update=function(ChangedParam){
        // Check image depends on the parameter (to avoid downloading a new copy of the same image)
        if(ChangedParam && this.Dependencies.indexOf(ChangedParam)==-1) return;

        // Convert the dependency array to a string (uses the overriden toString method in the Parameter class)
        var filename=this.Dependencies.join("");

        var section=document.getElementById(this.DisplayID)
            if(!section) {
                alert("Unable to find image html for image: "+ this.Name+ "\rPerhaps you haven't called writeHtml on this image");
                return;
            }
        section.setAttribute('src',filename+"."+this.DisplayExt);
        document.getElementById(this.DownloadID).setAttribute('href',filename+"."+this.DownloadExt);
    }

    //----------------- Register this image -----------------//
    // Register image with the controllable elements list so that it's informed when the parameters are changed
    ControllableElements.addElement(this);
}

////////////////////////////////////////////////////////////////////////////////////////////////
// 
// Parameter class
// 
////////////////////////////////////////////////////////////////////////////////////////////////
function Parameter(name,values,filenames){
// name (string): The name of the parameter which is used in html tag IDs.
// values (Array of strings): The possible values of the parameter as to be displayed on the webpage
// filenames (Array of strings): An array that corresponds to 'values' array and provides the 
//                               component for the filename for a given parameter value

    //----------------- Data members -----------------//
    this.Name=name;
    this.Values=values.slice(0);
    this.Filenames=filenames.slice(0);
    this.CurrentVal=0;

    //----------------- writeHtml -----------------//
    // Create the html code for the Parameter
    this.writeHtml=function(startup,columns,divID){
        // startup (integer): An integer giving the index of the startup value for the parameter.
        //                    Must be in the range [0,values.length[
        // columns (integer): An integer specifying the number of columns to use in the parameter value table.
        // divID [optional]: The ID of the div block that should contain the parameter.  
        //                    If not supplied, the parameter's name (this.Name) is used instead.
        this.CurrentVal=startup;

        // Create html for the table
        var html="<table class='value_table' id='tab_"+this.Name+"'>";
        for(i=0;i<this.Values.length;){
            html=html.concat("<tr>");
            for(var j=0;j<columns;j++){
                html=html.concat("<td>");
                html=html.concat("<a id="+this.getValueID(i)+" href=javascript:"+this.Name+".changeValue("+i+")> "+this.Values[i]+" </a>");
                html=html.concat("</td>");
                i++; //Increment parameter counter as we've added another value
                if(i>this.Values.length) break; // Not all rows may be complete
            }
            html=html.concat("</tr>");
        }
        html=html.concat("</table>");

        // Define the target for the parameter table.
        // If divID is supplied, use that, else use the parameter's name as the ID of the block.
        var target_div=typeof divID !=='undefined' ? divID: this.Name;

        // Place html for the parameter table into the parameter's div
        var section=document.getElementById(target_div);
        if(!section) {
            alert("Unable to find div with ID:"+ target_div+ " in Image.writeHtml")
                return;
        }
        section.innerHTML+=html;

        //Set the link styles
        this.setLinks()
    }

    //----------------- changeValue -----------------//
    // This function is used as the href target for the parameter value links
    this.changeValue=function(newVal){
        this.CurrentVal=newVal;
        this.setLinks();
        ControllableElements.updateControllables(this);
    }

    //----------------- setLinks -----------------//
    // Function to set the style of the parameter values 
    // Called when the link is clicked
    this.setLinks=function(){
        for(var i=0;i<this.Values.length;i++){
            if(i==this.CurrentVal){
                document.getElementById(this.getValueID(i)).setAttribute('class','current_value');
            }else{
                document.getElementById(this.getValueID(i)).setAttribute('class','value');
            }
        }
    }

    //----------------- getValueID -----------------//
    //Helper function to produce the id for the requested cell in the parameter table
    this.getValueID=function(index){
        return this.Name+"_"+index;
    }

    //----------------- getIndexOfValue -----------------//
    //Helper function to produce the id for the requested cell in the parameter table
    this.getIndexOfValue=function(value){
        return this.Filenames.indexOf(value);
    }

    //----------------- Register this parameter -----------------//
    // Register parameter on the ParameterList object
    ParameterList[this.Name]=this;
}

//----------------- toString -----------------//
// Override the default toString function to return the current value of the parameter
Parameter.prototype.toString=function(){
    //return (this.Name+"_"+this.Filenames[this.CurrentVal]);
    return (this.Filenames[this.CurrentVal]);
}

//----------------- Parameter List -----------------//
// An object to store all created parameters on (for ease of looping over all
// parameters and setting values from the URL
ParameterList=new Object();

////////////////////////////////////////////////////////////////////////////////////////////////
// 
// Controllable Element List
// 
////////////////////////////////////////////////////////////////////////////////////////////////
// Object to control a register of the controllable elements (images, tables, etc etc), that depend on the parameters.
// Any time a parameter has its value changed, the parameter tells this object to update all images with the new value.
    ControllableElements = new function(){
        // List of all images to loop over when a parameter is changed
        this.ElementList=new Array();

        // extend image list
        this.addElement=function(element){
            this.ElementList.push(element);
        }

        // Function to alert all elements that a parameter has changed
        this.updateControllables=function(ChangedParam){
            // Loop over all images and tell them to update
            for(i=0;i<this.ElementList.length;i++){
                this.ElementList[i].update(ChangedParam);
            }
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////
// 
//  Functions for loading the page
// 
////////////////////////////////////////////////////////////////////////////////////////////////
function ProcessUserOptions(){
    // Get all the user supplied parameters
    var parameters = location.search.substring(1);
    if(parameters=="") {return;}
    parameters = parameters.split("&");

    // Iterate over each parameter and if such a parameter exists set it's
    // current value to be the requested one
    for (var i in parameters){
        var input =parameters[i].split("=");
        if(ParameterList.hasOwnProperty(input[0])){
            var param=ParameterList[input[0]];
            var index =param.getIndexOfValue(input[1]);
            if(index>=0)param.changeValue(index);
            else alert("Parameter '"+input[0]+"' has no value, '"+input[1]+"'")
        } else { 
            alert("Parameter '"+input[0]+"' not found.");
        }
    }
}

window.onload=function(){
    ProcessUserOptions();
    ControllableElements.updateControllables();
}
// -->

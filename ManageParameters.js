<!--
//Set up list of all parameters
var params=new Object();
params.length=new Parameter('length','Target Length (cm)',Array('15','30','60','80'),Array('length-15cm_radius-6mm','length-30cm_radius-6mm','length-60cm_radius-6mm','length-80cm_radius-6mm'),0,SetLinks,SetAll,4);
params.place=new Parameter('place','Location',Array('. Bent Solenoid Entry', '. Before Stopping Target','. CDC cylinder', '. CDC exit'),Array('ptacs_exit','ts2_tgt','cdc_pre','ts2_1'),0,SetLinks,SetAll,1);
params.particle=new Parameter('particle','Particle',Array('All','Other','mu-','mu+','pi-','pi+','e-','e+','K-','K+','n','p','He-3','H-3','H-2','gamma'),Array('all','remainder','mu_n','mu_p','pi_n','pi_p','e_n','e_p','K_n','K_p','n','p','He3','H3','H2','gamma'),0,SetLinks,SetParticle,2);

function MakePlotName(plot){
    var filename="plots/";
    filename+=params['length'].getCurrValString();
    filename+="/";
    filename+=plot;
    filename+="/";
    filename+=params['place'].getCurrValString();
    filename+="_";
    if(plot=="mom" || plot=="time"){
	filename+=params['particle'].getCurrValString(0);
    }else{
	filename+=params['particle'].getCurrValString();
    }
    return filename;
}

function MakeDataName(plot){
    var filename="numbers/";
    filename+=params['length'].getCurrValString();
    filename+="_";
    filename+=params['place'].getCurrValString();
    return filename;
}

//function SetLengthLinks()

function SetAll()
// Update all images
{
    //Draw momentum plot
    var momentum_base=MakePlotName("mom");
    document.getElementById('momentum_pic').setAttribute('src',momentum_base+".png");
    document.getElementById('momentum_pic_eps').setAttribute('href',momentum_base+".eps");

    //Draw time plot
    var time_base=MakePlotName("time");
    document.getElementById('time_pic').setAttribute('src',time_base+".png");
    document.getElementById('time_pic_eps').setAttribute('href',time_base+".eps");

    // Draw all other plots
    SetParticle();

    //Update the numbers table
    var numbers=MakeDataName();
    document.getElementById('summary_numbers').setAttribute('src',numbers+".html");

}

// Update particle dependent images
function SetParticle()
{
    var mom2d_base=MakePlotName("mom2d");
    document.getElementById('mom2d_pic').setAttribute('src',mom2d_base+".png");
    document.getElementById('mom2d_pic_eps').setAttribute('href',mom2d_base+".eps");

    var dispersion_base=MakePlotName("dispersion");
    document.getElementById('dispersion_pic').setAttribute('src',dispersion_base+".png");
    document.getElementById('dispersion_pic_eps').setAttribute('href',dispersion_base+".eps");

    var profile_base=MakePlotName("profile");
    document.getElementById('profile_pic').setAttribute('src',profile_base+".png");
    document.getElementById('profile_pic_eps').setAttribute('href',profile_base+".eps");

}

function SetLinks(){
    var num=/\d+/;
    var entry;
    for(var p in params){
	entry=params[p].valuesList();
	for(var i=0;i<entry.length;i++)
	{
	    var e=num.exec(entry[i]);
	    if(e==params[p].currentVal){
		document.getElementById(entry[i]).setAttribute('class','parameter_curr');
	    }else{
		document.getElementById(entry[i]).setAttribute('class','parameter');
	    }
	}
    }
}

function Parameter(name,title,values,filenames,startup,setLinks,setImages,columns){
    this.name=name;
    this.title=title;
    this.values=values.slice(0);
    this.filenames=filenames.slice(0);
    this.currentVal=startup
    this.setLinks=setLinks;
    this.setImages=setImages;
    this.columns=columns;

    this.changeValue=changeValue;
    function changeValue(newVal){
	this.currentVal=newVal;
	this.setLinks();
	this.setImages();
    }

    this.getCurrValString=getCurrValString;
    function getCurrValString(index){
	index = typeof index !== 'undefined' ? index : this.currentVal;
	//return (this.name+"_"+this.filenames[this.currentVal]);
	return (this.filenames[index]);
    }

    this.drawParam=drawParam;
    function drawParam(section){
	var html="<div class=parameter id="+this.name+">";
	html=html.concat("<h1>"+this.title+"</h1>");
	html=html.concat("<table class='parameter_table' id='"+this.name+"'>");
	var i=0;
	while(i<this.values.length){
	    html=html.concat("<tr>");
	    for(var j=0;j<this.columns;j++){
		html=html.concat("<td>");
		html=html.concat("<a id="+this.name+"_"+i+" class=parameter href=javascript:params['"+this.name+"'].changeValue("+i+")> "+this.values[i]+" </a>");
		html=html.concat("</td>");
		i++;
		if(i>this.values.length) break;
	    }
	    html=html.concat("</tr>");
	}
	html=html.concat("</div>");
	section.innerHTML+=html;
    }

    this.valuesList=valuesList;
    function valuesList(){
	var list=new Array();
	for(var i=0;i<values.length;i++){
	    list[i]=this.name+"_"+i;
	}
	return list;
    }
}

function Startup(){
    var section=document.getElementById('parameter_block');
    for(p in params){
	params[p].drawParam(section);
    }
    SetLinks();
    SetAll();
//    SetFilter();
}

window.onload=Startup;
// -->

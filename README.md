Plotify
=======
Display plots in a webpage and provide the viewer with controls to change the parameters used to make the plots.

Concept
-------
Often in particle physics, we produce hundreds of similar plots for variations of the input data.
The challenge is then to find a sensible way to show these plots so that the viewer can compare the differences between the different input parameters.

With that in mind, you can use the javascript code in this repository to easily set up a webpage that places the adjustable variables on one side of the screen, and the plots in the centre.
The different values are clickable so that in doing so the plots update to match the new parameters. Images themselves can be clicked on to download the image in some other format (such as pdf, or root) unless the browser can display that type of image, in which case they open in a new window/tab.

On the whole I've tried to keep the code as simple as possible and have tried to leave as much of the decisions up to the user.
For instance, the Parameter class does not request a title.  Writing and placing the html code for a title is left to the user to arrange as desired.
I hope that this provides both flexibilty, and easier to read Html.

Authors 
-------
Ben Krikler

There should probably be some sort of open source license on this, but for now just give us a mention when (if) you use this, put a citation at the bottom of the webpage or something to that effect.

HTML, css and javascript
------------------------

For those unfamiliar with the HTML, css and javascript, you may want consult [this website](http://www.w3schools.com) 
for tutorials and explanation. 


Usage
-----
The aim in writing this code was to make it as easy as possible to use.
To that end, there are only four javascript functions needed to create the functionality described above:

1. A Parameter constructor
2. A method to create and place the html for a Parameter
3. An Image constructor
4. A method to create and place the html for an Image

### 1) Add a Parameter
Each parameter is list of values and corresponding segments of the filename.
To create a parameter:

1. Create an instance of the Parameter class.
2. Call writeHtml() on that instance.

For example:

```javascript
param= new Parameter("aParam", Array("A","B","C"),Array("zero","one","two"))
param.writeHtml(1,2)
```
This will create a parameter called "aParam", with three possible values, displayed as 'A','B' and 'C' to the user, but written as 'zero','one' and 'two' in the filenames.
The parameter is then placed on the page via the writeHtml function, which, in this case, selects the value whose index is 1 (ie. the current value will be set to "B" on the webpage).
The value table is drawn with 2 columns as specified by the second parameter.
An optional third argument could be used to specify the ID of the target div that should contain the value table.
If this is not supplied, the name of the parameter is used as the target div's ID, so in the above example, the html would be placed in the div whose ID is 'aParam'.

### 2) Add an Image
An image is added similarly to a Parameter, by creating an instance of the Image, and then calling writeHtml() on it.
For example:

```javascript
plot= new Image("plot", "Some amazing physics",Array("path/",aParam,"_",anotherParam,"/plot"),"png","pdf")
param.writeHtml("","theMainPlot")
```
This will create an Image whose name is simply, "plot".  The alt text used on the image will be, "Some amazing physics" and the image will use a ".png" extension for the webpage images, but download pdf versions when the images are clicked on.
The third parameter is perhaps the most crucial.  It tells the Image how to produce the filename for the image from the parameters on the page.  The elements of the array are joined together into a string, replacing any instances of the Parameter class (in the example, `aParam` and `anotherParam`) with their currently selected value.

Lastly, the writeHtml function is called.  The first parameter provides the abiltiy to override the default img class.  Because the string passed in is empty however, the img tags class will be "plot".  The last argument provides the ID of the div that should be used and is optional in the same way as for the Parameter Class' writeHTML.

Recipe to create a page
-----------------------
1. Produce your plots and analyses and make sure they are stored in a logical way, using the same string to represent each value of a parameter. 
   (Personally, I prefer creating a directory for the full set of parameters using the values separated with underscores. I then put all the various plots for a given set of values in the corresponding directory.)
2. Create the layout of the webpage using normal html, creating a div for each parameter to be added.
3. Instantiate all the Parameters you need
4. Create the Html for all Parameters (using Parameter's writeHtml method)
5. Instantiate all the Images you need
6. Create the Html for all Images (using Image's writeHtml method)
7. Adapt the css styles for the parameters (classes: value, current_value) and for the images (classes: plot if default value used).

The writeHtml methods (steps 4 and 6) can only be used once the div that contains them has been created.  A simple way to do this is to place the writeHtml inside a pair of script tags within the div itself.  This should also make the original html more readable. An alternative is to group all writeHtml calls (and possibly even the Image and Parameter instantiations) at the bottom of the wepage.
Notes
=====
1. All images use relative links to find the image source.
2. The ControllableElements object implements a form of the Observer pattern (I think).
3. ICHEP servers can only do static server-side includes, so that to achieve the desired affect for this project, we must use javascript that is run by the client's machine.

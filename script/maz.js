var rows;
var columns;
var box;
var instance;

var above = 0;
var below = 1;
var left  = 2;
var right = 3;

var dirs   = [0,1,2,3]; // direction of neighbors
var undirs = [1,0,3,2]; // opposite direction
var delta  = { x:[0, 0,-1, 1], y:[-1, 1, 0, 0] }; // offsets of neighbors

/**
 *
 */
function generator(maze) 
{
    stopSolver(); // make sure that the solver is shutdown first
            /* a stack containing coordinates of the current cell and */
            /* a scrambled list of the direction to its neighbors */
            var stack = [ { x: Math.floor(rnd() * columns), y: Math.floor(rnd() * rows), neighbors: dirs.shuffle() } ] ;
    
            iter(function () { return dfs(maze, stack) }, rows * columns, function () { builder(maze) });
            
    
}

/**
 * Generates the maze using the Depth-First Search algorithm
 */
function dfs(maze, stack)
{
    var cell = stack.peek();

    x = cell.x;
    y = cell.y;
    neighbors = cell.neighbors;

    // when all cells have been visited at least once, it's done
    if(maze.cells[x][y].visited == false)
    {
        maze.cells[x][y].visited = true;
        maze.visitedCount++;
    }

    /* look for a neighbor that is in the maze and hasn't been visited yet */
    while(neighbors.length > 0)
    {
        dir = neighbors.pop();
        if(neighbors.length == 0)
        {
            stack.pop(); // all neighbors checked, done with this one.
        }

        dx = x + delta.x[dir];
        dy = y + delta.y[dir];
        if(dx >= 0 && dy >= 0 && dx < columns && dy < rows)
        {
            if(maze.cells[dx][dy].visited == false)
            {
                /* break down the wall between them. The new neighbor */
                /* is pushed onto the stack and becomes the new current cell */
                maze.cells[x][y].wall[dir] = false;
                maze.cells[dx][dy].wall[undirs[dir]] = false;
                stack.push( { x: dx, y: dy, neighbors: dirs.shuffle() } );
                break;
            }
        }
    }
    
    return maze.visitedCount; // when visited count == row * columns it's done
}

function builder(maze)
{
    /* remove start and end walls */
    maze.cells[maze.start.x][maze.start.y].wall[above] = false;       
    maze.cells[maze.end.x][maze.end.y].wall[below]     = false;  
    
    /* create the element to hold the maze itself */
    var token = document.createElement("div");
    token.setAttribute("id", "maze");

    /* kick off the builder iterator */
    iter(function (row) { return mazeRowBuilder(maze, token, row) }, rows, function () { displayer(box, token) });     
                    
    /**
     * Create an HTML element that represents a row in the maze
     */
    function mazeRowBuilder(maze, token, y)
    {
        var row = document.createElement("div");
        row.setAttribute(classAttr, "mrow");

        token.appendChild(row);

        iter(function (column) { return mazeCellBuilder(maze, row, column, y) }, columns);

        return y + 1;
    }
    
    /**
     * Creates an HTML element that represent an individual cell in the maze
     */
    function mazeCellBuilder(maze, row, x, y)
    {
        var cell = maze.cells[x][y];
        cell.token = createToken(cell.wall, x, y);
        cell.visited = false;
        
        row.appendChild(cell.token);
        
        return x + 1;
    }
    
    /**
     * Create an HTML element that represents an individual cell
     */
    function createToken(wall, x, y)
    {
        var div = document.createElement("div");
    
        var classes = "cell";
    
        if(x == 0)
        {
            classes = classes + (wall[left] ? " left" : " noleft");
        }
    
        if(y == 0)
        {
            classes = classes + (wall[above] ? " top" : " notop");
        }
    
        if(x < (columns - 1))
        {
            classes = classes + (wall[right] ? " right" : " noright");
        }
        else
        {
            classes = classes + (wall[right] ? " right" : "");
        }
    
        if(y < (rows - 1))
        {
            classes = classes + (wall[below] ? " bottom" : " nobottom");
        }
        else
        {
            classes = classes + (wall[below] ? " bottom" : "");
        }
    
        div.setAttribute(classAttr, classes);
        
        /* ie has an issue when printing empty divs */
        if(ie)
        {
            var span = document.createElement("span");
            div.appendChild(span);
        }
    
        return div;
    }
}


/**
 * Make the maze visible 
 */
function displayer(parent, token)
{    

    
    setTimeout( function() 
    {
   

        /* make the newly created maze visible */
        parent.style.visibility = "visible";

        /* attach the maze to the container box */
        parent.appendChild(token);    

        /* enable the generate and solve buttons */
        document.forms.mazeform.slv.disabled = false; 
        document.forms.mazeform.bld.disabled = false;
    }, 250);
}

/**
 * A maze object, which is an 2D array of cells
 */
function maze(type)
{
    this.cells = new Array();
    this.start = {x: 0, y: 0};
    this.end   = {x: columns - 1, y: rows - 1};
    this.type  = type;
    this.visitedCount = 0;
    
    /**
     * Provides a level of indirection to the builder() method which can't
     * use a 'this' reference
     */
    this.build = function()
    {
        builder(this); 
    }
    
    /**
     * Kicks of the initialization iteration, then continues with the generator()
     */
    function builder(maze)
    { 
        iter( function(column) { return rowInitializer(maze, column) }, columns, 
                    function() { generator(maze) });   
    }

    /**
     * Initializes the maze one row at a time
     */
    function rowInitializer(maze, x)
    {
        maze.cells[x] = new Array(columns);

        for(y = 0; y < rows; y++)
        {
            maze.cells[x][y] = new cell();
        }
        
        return x + 1;
    }

    /**
     * A cell object
     */
    function cell()
    {
        this.token = null; // reference to the div for when we're solving
        this.visited = false;
        this.wall = [ true, true, true, true ];
    }
}

/**
 * Add a function to Array that returns a shuffled copy
 * of the current array contents
 */
Array.prototype.shuffle = function()
{
    var that = this.slice();
    for(var j, x, i = that.length; i; j = parseInt(rnd() * i), x = that[--i], that[i] = that[j], that[j] = x);
    return that;
}

/**
 * Add a function to Array that returns that last element.
 * equivalent to a peek operation on a stack
 */
Array.prototype.peek = function()
{
    return this[this.length - 1];
}

/**
 * A generalized continuation mechanism for javascript
 *
 * Calls a function f(i) until it returns a result that indicates processing is complete.  The
 * value "state" passed to f() is the result of the previous call to f().  Every "max" iterations,
 * processing is yielded to allow responsiveness.
 * 
 * f    - a function that takes a state parameter and returns an updated state
 * done - the final state that indicates that iteration is complete
 * fc   - an optional continuation function that is called when processing is complete
 * fp   - an optional callback function used to indicate progress though the iteration
 */
function iter(f, done, fc, fp)
{
    var max   = 50; // a reasonable number
    var count = 0;    

    /* define the loop function that will manage the calls to f() */
    var loop = function (state)
    {
        while((state = f(state)) != done)
        {   
            if (count < max) 
            {
                count++;
            } 
            else 
            {
                count = 0;
                setTimeout(function() { loop(state) }, 0);
                break;
            }
        }
        
        if(fp)
        {
            fp(state, done);
        }
          
        if(fc && (state == done)) 
        {
            setTimeout(function() { fc() }, 0);
        }
    }
    
    /* call the loop function with the initial state */
    loop(0);
}

/**
 * Seedable random number generator function
 */
function rnd() 
{
    rnd.seed = (rnd.seed*9301+49297) % 233280;
    return rnd.seed/(233280.0);
};


/**
 * Make sure all the scripts have loaded before turning on the generate button
 */
window.onload = function()
{
    document.forms.mazeform.bld.disabled = false;   
//    checkURL();
}


/**
 * Creates the maze and renders it on the page.
 */
function build()
{
    columns = Number(document.forms.mazeform.x.value);
    rows    = Number(document.forms.mazeform.y.value);
    size    = 25;
    seed    = Math.floor(Math.random() * 1000000000);
    
    var type = 1;
    dom(rows, columns, size, type, seed);
}

/**
 *
 */
function dom(nrows, ncolumns, nsize, ntype, seed)
{
    rows     = nrows;
    columns  = ncolumns;
    size     = nsize;
    type     = ntype;
    rnd.seed = seed;
    
    /* disable the Generate and Solve buttons until it's generated */
    document.forms.mazeform.slv.disabled = true;
    document.forms.mazeform.bld.disabled = true;
    
    /* get the HTML element for the container to hold the maze */
    /* and delete the old one if any */
    box   = document.getElementById("box");
    omaze = document.getElementById("maze");
    if(omaze != null)
    {
        box.removeChild(omaze);
    }
      	
	
    /* set the width of the box based on the size of the maze */
    box.style.width = ((columns * size) + 2) + "px";
    
    /* the style of the CSS class ".cell" needs to be updated dynamically
       which has some browser-specific quirks */
    var style = document.styleSheets[2];
    var rules = style.cssRules;
    
    /* IE doesn't understand the cssRules property */
    if(rules != undefined)
    {   
        /* instead of hard-coded rule numbers, we should be able to
           use rules.length, but Safari has a bug where the size of 
           the rules array doesn't change even after a rule is deleted */
        style.deleteRule(14);    
        style.deleteRule(13);   
        style.insertRule(".cell {height: " + size + "px}", 13);
        style.insertRule(".cell {width: "  + size + "px}", 14);
        
        classAttr = "class";
        ie = false;
    }
    else
    {
        rules = style.rules; // ie-speak
        rules[15].style.height = size + "px"; // nor does it count the       
        rules[16].style.width  = size + "px"; // rules in the same way
        
        classAttr = "className"; // ie-speak
        ie = true;
    }
    
    /* create maze object */
    instance = new maze(type);
    
    /* render and display */
    instance.build();
    
    /* tell the form not to actually submit anything */
    return false;
}
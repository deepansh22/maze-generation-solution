
/* indicates that the solver should be stopped */
var stop;

/**
 * We want to show the solution being generated dynamically, so replace the outer
 * while() loop in the build() method with a timer that checks the stack 
 * every m milliseconds.  This gives the browser a chance to refresh the display; 
 * otherwise it would only show the final state.
 */
function solve()
{

    /* re-seed with a random number */
    rnd.seed = Math.floor(Math.random() * 1000000000);
    
    /* initialize the flag */
    stop = false;
    
    /* Initialize the stack at the first element */
    var stack = [ { m: instance.start.m, n: instance.start.n, neighbors: dirs.shuffle() } ] ;
    
    /* Add a new breadcrumb every zillisecond */
    setTimeout(function() { solver(instance, stack) }, 10);
    
    /* Disable the form button again */
    document.forms.mazeform.slv.disabled = true;
}

/**
 * Indicate we want to stop
 */
function stopSolver()
{
    stop = true;
}

/**
 * Main algorithm to solve the maze
 */
function solver(maze, stack)
{
	
    if(stop)
    {
        return;    
    }
    
    var current = stack.peek();
    
    m = current.m;
    n = current.n;
    neighbors = current.neighbors;
    var cell = maze.cells[m][n];

    cell.visited = true;
    cell.token.style.backgroundPosition = "center";  
	     cell.token.style.backgroundImage = "url(image/breadcrumb.png)";
    
    // see if we're at the exit
    if((m == (columns - 1)) && (n == (rows - 1)))
    {
        stopSolver();  // done
        return;
    }  
    
    var found = false;
    
    /* look for a connected neighbor that hasn't been visited yet */
    while(neighbors.length > 0)
    {
        dir = neighbors.pop();
     
        if(cell.wall[dir] == false)
        {            
            dm = m + delta.m[dir];
            dn = n + delta.n[dir];
            if(dm >= 0 && dn >= 0 && dm < columns && dn < rows)
            {
                if(maze.cells[dm][dn].visited == false)
                {
                    stack.push( { m: dm, n: dn, neighbors: dirs.shuffle() } );
                    found = true;
                    break;
                }
            }
        }              
    }
    
    if(neighbors.length == 0)
    {
        if(found == false)
        {
            stack.pop();
           
            cell.token.style.backgroundImage = "url(image/checked.png)";
        }
    }
    
    if(! stop)
    {
        setTimeout(function () { solver(maze, stack) }, 10);
    }
	
}

function ply(u)
{
	var dt,dh;
	
	
	
	
	switch(u)
	{
		case 0:
	{
		if(h>0&&instance.cells[t][h].wall[u] ==false) 
		{ 
	    var cy = instance.cells[t][h];
			cy.token.style.backgroundImage = "url(image/white.png)";
	    var cell = instance.cells[t][h-1];
		 
	
		h=h-1;
	    cell.token.style.backgroundPosition = "center";
		 cell.token.style.backgroundImage = "url(image/breadcrumb.png)";
	
	
		} 
		break;
	}
	
		case 1:
	{
		if(instance.cells[t][h].wall[u] ==false) 
		{ 
	    var cy = instance.cells[t][h];
			cy.token.style.backgroundImage = "url(image/white.png)";
			
		
		
		var cell = instance.cells[t][h+1];
		h=h+1;
	    cell.token.style.backgroundPosition = "center";
		 cell.token.style.backgroundImage = "url(image/breadcrumb.png)";
		 } 
		break;
	}
		case 2:
	{
		if(instance.cells[t][h].wall[u] ==false) 
		{ 
	var cy = instance.cells[t][h];
			cy.token.style.backgroundImage = "url(image/white.png)";
		var cell = instance.cells[t-1][h];
		t=t-1;
	    cell.token.style.backgroundPosition = "center";
		 cell.token.style.backgroundImage = "url(image/breadcrumb.png)";
		 } 
		break;
	}
	
	
		case 3:
	{
		if(instance.cells[t][h].wall[u] ==false) 
		{ 
	var cy = instance.cells[t][h];
			cy.token.style.backgroundImage = "url(image/white.png)";
		var cell = instance.cells[t+1][h];
		t=t+1;
	    cell.token.style.backgroundPosition = "center";
		 cell.token.style.backgroundImage = "url(image/breadcrumb.png)";
		 } 
		break;
	}
	
	   case 4:
{
		var cell = maze.cells[0][0];

    
    cell.token.style.backgroundPosition = "center"; 
	}
	
	
	}
	
	if(t==n&&h==m)
	{
		
		t=0;
		h=0;
		alert("I am an alert box!");
	}
	return;
	
	
    /* Disable the form button again */
    document.forms.mazeform.slv.disabled = true;
}

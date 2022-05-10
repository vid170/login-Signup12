try{
 

    window.onload = function() {
   
  inactivityTime();
 }
 let time=null;
 function logout() {
        alert("You will be logged out now.")
        location.href="logout"
    }
    
 function resetTimer() {
        time = window.setTimeout(logout, 5*60*1000)
        console.log("time:",time)
 }
 
 
    var inactivityTime = function (req, res) {
    try{
    resetTimer();
 
    window.onclick = function(){
     clearTimeout(time);
     console.log("cleared")
     resetTimer();  
    }
       
    console.log("buakgj")
 
    window.onmousedown = function(){
     clearTimeout(time);
     console.log("cleared")
     resetTimer();  
    }
    window.onmousemove = function(){
     clearTimeout(time);
     console.log("cleared")
     resetTimer();  
    }
 
  
    window.ontouchmove = function(){
     clearTimeout(time);
     console.log("cleared")
     resetTimer();  
    }
       
    window.onkeydown = function(){
     clearTimeout(time);
     console.log("cleared")
     resetTimer();  
    }
    window.onkeypress = function(){
     clearTimeout(time);
     console.log("cleared")
     resetTimer();  
    }
    window.addEventListener('scroll',function(){
     clearTimeout(time);
     console.log("cleared")
     resetTimer();  
    } , true); 
       
   
   window.onscroll = function(){
     clearTimeout(time);
     console.log("cleared")
     resetTimer();  
    }
   
 }
 catch(error)
 {
    console.log(error)
 }
 };
       }catch(error)
       {
           console.log(error)
       }
 
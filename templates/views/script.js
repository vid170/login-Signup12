try{
    console.log("ha ha ")

   window.onload = function() {
  
 inactivityTime();
}
console.log("vimdhi")
   var inactivityTime = function (req, res) {
   try{
   resetTimer;
   var time;
   // global.window.onload = resetTimer;
   global.document.onmousemove = resetTimer;
   global.document.onkeydown = resetTimer;
   global.window.onmousedown = resetTimer;  // catches touchscreen presses as well      
   global.window.ontouchstart = resetTimer; // catches touchscreen swipes as well      
   global.window.ontouchmove = resetTimer;  // required by some devices 
   global.window.onclick = resetTimer;      // catches touchpad clicks as well
   global.window.onkeydown = resetTimer;
   global.window.addEventListener('scroll', resetTimer, true); // improved; see comments
   function logout() {
       // alert("You are now logged out.")
       console("hmlo log out")
       href="/logout"
   }

   function resetTimer() {
       clearTimeout(time);
       time = setTimeout(logout, 10000)
       console.log("time:",time)

   }
}
catch(error)
{
   console.log(error)
}
};
}
catch(err)
{
console.log(err)
}
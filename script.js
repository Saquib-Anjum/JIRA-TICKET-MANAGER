let addBtn = document.querySelector('.add-btn');

let removeBtn = document.querySelector('.remove-btn');

let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector('.main-cont');
let textareaCont= document.querySelector(".textarea-cont");
let allPriorrityColors = document.querySelectorAll('.priority-color');

let toolBoxColor = document.querySelectorAll('.color');

let ticketLock = document.querySelector('ticket-lock');

let toolBoxColors= document.querySelectorAll('.color');

let colors = ["lightpink","lightblue","lightgreen","black"];

let modalPriorityColor = colors[colors.length-1];

let addFlag = false;
let removeFlag = false;

let lockClass =  ' fa-lock"';
let unlockClass =' fa-unlock';

let ticketArr=[];


if(localStorage.getItem("Jira-Ticket")){
    ticketArr = JSON.parse(localStorage.getItem("Jira-Ticket"));
    ticketArr.forEach((ticketObj)=>{
        createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId)
    })
}

//Listener for priority color of modal

allPriorrityColors.forEach((colorElem)=>{
   colorElem.addEventListener('click',(e)=>{
    allPriorrityColors.forEach((priorityColorElem,idx)=>{
        priorityColorElem.classList.remove('border');

        

    })
    colorElem.classList.add("border");
    modalPriorityColor = colorElem.classList[0];
   })
})


addBtn.addEventListener('click', (e) => {
    // Toggle the modal display when the Add button is clicked
    addFlag = !addFlag;
    console.log(addFlag);

    if (addFlag) {
        modalCont.style.display = "flex";
    } else {
        modalCont.style.display = "none";
    }
});

removeBtn.addEventListener('click',(e)=>{
    removeFlag =!removeFlag;
})

// When the "Shift" key is pressed inside the modal, create a ticket
modalCont.addEventListener('keydown', (e) => {
    let key = e.key;
    if (key === "Shift") {
        createTicket(modalPriorityColor, textareaCont.value);
        setModalToDefault();
         // Hide modal after creating the ticket
        addFlag = false;  // Reset addFlag after ticket creation

     
    }
});

function createTicket(ticketColor, ticketTask, ticketId) {
 
  let id =ticketId || shortid.generate();
 
 

    // Create a new ticket container

    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");

    // Assign a random ID to the ticket (you can change this logic)
    // let  ticketId = `#${Math.random().toString(36).substring(2, 9)}`;
    

    // Add the ticket HTML structure with the dynamic ID and ticket color
    ticketCont.innerHTML = `
        <div class="ticket-color" style="background-color: ${ticketColor};"></div>
        <div class="ticket-id">${id}</div>
        <div class="task-area">${ticketTask}</div>
       <div class="ticket-lock">
          
       <i class="fa-solid fa-lock"></i>
         
        </div>
    `;
    // Append the new ticket to the main container
 mainCont.appendChild(ticketCont);
 //adding the ticket into array 
if(!ticketId){
     ticketArr.push({ticketColor,ticketTask,ticketId:id});
     localStorage.setItem("Jira-Ticket" , JSON.stringify(ticketArr));
}
 console.log(ticketArr);

    handleRemoval(ticketCont , id);
    handleLock(ticketCont,id);

    handleColor(ticketCont,id);
}
//handling removal function  

// Handle ticket removal
function handleRemoval(ticket, id) {
    ticket.addEventListener('click', () => {
        if (removeFlag) {
            // Find the index of the ticket to be removed in the ticketArr
            let ticketIdx = ticketArr.findIndex(ticketObj => ticketObj.ticketId === id);

            // Remove the ticket from the array if the index is valid
            if (ticketIdx !== -1) {
                ticketArr.splice(ticketIdx, 1);  // Remove ticket from the array
                ticket.remove();  // Remove the ticket element from the DOM

                // Update local storage with the modified ticketArr
                localStorage.setItem("Jira-Ticket", JSON.stringify(ticketArr));
            }
        }
    });
}


function handleLock(ticket,id ) {
    let ticketLockElem = ticket.querySelector('.ticket-lock');
    let ticketIdx =getTicketIndex(id);
    let ticketLock = ticketLockElem.children[0];  // Get the lock/unlock icon
    let ticketTaskArea = ticket.querySelector('.task-area');  // Corrected selector for task-area

    ticketLock.addEventListener('click', (e) => {
        console.log("Clicked on lock/unlock icon"); // Debugging log to check if the click is registered
        console.log("Current classes on lock icon:", ticketLock.classList.value); // Check current classes

        if (ticketLock.classList.contains(lockClass.trim())) {  // Use `trim()` in case of extra spaces
            console.log("Lock detected, unlocking...");  // Debugging log
            ticketLock.classList.remove(lockClass.trim());
            ticketLock.classList.add(unlockClass.trim());
            ticketTaskArea.setAttribute('contenteditable', 'true');  // Make task area editable

        } else {
            console.log("Unlock detected, locking...");  // Debugging log
            ticketLock.classList.remove(unlockClass.trim());
            ticketLock.classList.add(lockClass.trim());
            ticketTaskArea.setAttribute('contenteditable', 'false');  // Make task area non-editable
        }

        console.log("Updated classes on lock icon:", ticketLock.classList.value);  // Check updated classes

        //modify task area data  =>ticket task area

       ticketArr[ticketIdx].ticketTask = ticketTaskArea.innerHTML;
       localStorage.setItem("Jira-Ticket",JSON.stringify(ticketArr));
    });
}

// function for update priority color while clicking

function handleColor(ticket ,id) {
    let ticketColor = ticket.querySelector('.ticket-color');
    //get ticket from the ticket  
    let ticketIdx = getTicketIndex(id);
    ticketColor.addEventListener('click', (e) => {
        let currentTicketColor = ticketColor.style.backgroundColor;
        let currentTicketColorIdx = colors.indexOf(currentTicketColor);
        currentTicketColorIdx = (currentTicketColorIdx + 1) % colors.length;
        let newTicketColor = colors[currentTicketColorIdx];
        ticketColor.style.backgroundColor = newTicketColor;  // Use backgroundColor for changing colors

        //modify data in local storage 
        ticketArr[ticketIdx].ticketColor = newTicketColor;

        localStorage.setItem("jira-Ticket" ,JSON.stringify(ticketArr));
    });
}

function getTicketIndex(id){
  let ticketIdx = ticketArr.findIndex((ticketObj,idx)=>{
    return ticketObj.ticketId===id;
  })
  return ticketIdx;
}
//filter ticket based on the  color in ticket container 
for(let i=0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener('click' , (e)=>{
         let currentToolBoxColor = toolBoxColors[i].classList[0];
        ticketArr.filter((ticketObj,idx)=>{
            //filter ticket based on the color
            let filteredTickes = ticketArr.filter((ticketObj,idx)=>{
              return currentToolBoxColor===ticketObj.ticketColor;
            })
            //remove previous ticket
            let allTicketCont = document.querySelectorAll('.ticket-cont');
            for(let i=0;i<allTicketCont.length;i++){
                allTicketCont[i].remove()
            }
        //        Clear all current tickets before rendering filtered ones
        //    mainCont.innerHTML = '';
            //display filtred ticket ticket              
            filteredTickes.forEach((ticketObj,idx)=>{
                createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId)
            })   
        })

     
    }) 
    

    // Restore all tickets on double click
    toolBoxColors[i].addEventListener('dblclick' ,(e)=>{
        let allTicketCont =document.querySelectorAll('.ticket-cont');
        for(let i=0;i<allTicketCont.length;i++){
            allTicketCont[i].remove()
        }
 // Recreate all tickets from the ticketArr array
        ticketArr.forEach((ticketObj,idx)=>{
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId)
        });
    }) ;  
}


function setModalToDefault(){
    modalCont.style.display = "none";
       textareaCont.value=" "
    allPriorrityColors.forEach((priorityColorElem,idx)=>{
        priorityColorElem.classList.remove('border');
    })
    allPriorrityColors[allPriorrityColors.length-1].classList.add("border");
}







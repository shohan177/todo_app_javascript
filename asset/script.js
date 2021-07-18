let todoForm = document.querySelector('#todo-form');
let warning_alert = document.querySelector('#todo-form p');
let note_input = document.querySelector('#note');
let client_name_input = document.querySelector('#c_name');
let date_input = document.querySelector('#date');
let time_input = document.querySelector('#time');
let todo_show = document.querySelector('#todo_list_show');
let no_task = document.querySelector('#no_task');

/**
 * form submiation
 */
todoForm.onsubmit = (e) => {
    e.preventDefault();
    
    //form valu get    
    let note = note_input.value;
    let client_name = client_name_input.value;
    let date = date_input.value;
    let time = time_input.value;
    
        let dateArry = date.split("-");
        let timeArry = time.split(":");
        
        let datestring = dateArry[1] + " " + dateArry[2] + "," + " " + dateArry[0] + " " + timeArry[0] + ":" + timeArry[1] + ":" + 00;
        
        let count = timeCoundown(datestring);

    //input fild check
    if (note == "" || client_name == "" || date == "" || time == "") {
        
        warning_alert.innerHTML = "all fild required";
    }else if(pickDateCheck(date)){
        warning_alert.innerHTML = "You can't set previous date";
    }else {
       
        warning_alert.innerHTML = "";

        data = {
            text_note: note,
            client: client_name,
            exp_data: date,
            total_second: count.totalsecond,
            exp_time: time,
            done_work: 0,
        }

        let todo_storage = loaclStorage();
        todo_storage.push(data);
        //insert data into local storage
        localStorage.setItem('todo', JSON.stringify(todo_storage));
        taskCheck()
        showAll()
        clear();
    }

    
}
setInterval(() => {
    showAll()
},1000)


/**
 * todo list show
 */
function showAll() {
    let todo_data = loaclStorage();
    let date = new Date();
    let todo_list = "";
    taskCheck()
    todo_data.map((val, index) => {
        
       
        let dateArry = val.exp_data.split("-");
        let timeArry = val.exp_time.split(":");
        
        let date_string = dateArry[1] + " " + dateArry[2] + "," + " " + dateArry[0] + " " + timeArry[0] + ":" + timeArry[1] + ":" + 00;
        
        let count = timeCoundown(date_string,val.done_work);
            
        todo_list += `<li class="list-group-item border-warning shadow mt-2 ${count.color}">
        <div class="row">
            <div class="col-6">
            ${val.text_note}
            </div>
            <div class="col-1 border-left">
            ${val.client}
            
            </div>
            <div class="col-4 border-left border-right">
                D : <span class="badge badge-info" style="font-size: 20px;">${count.days}</span>
                H : <span class="badge badge-info" style="font-size: 20px;">${count.hours}</span>
                M : <span class="badge badge-info" style="font-size: 20px;">${count.minutes}</span>
                S : <span class="badge badge-info" style="font-size: 20px;">${count.seconds}</span>
            </div>
            <div class="col-1 btn-group btn-sm">
                    <a class="btn btn-success" onclick="WorkDone(${index})">
                        <i class="fa fa-check-circle" aria-hidden="true"></i>
                    </a>
                    <a class="btn btn-danger btn-danger btn-sm" onclick="deleteTodo(${index})">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </a>
                    
            </div>
        </div>
        <div class="row" style="margin-bottom: -17px;
    }">
            <progress style="width:100%" value="${count.totalsecond}" max="${val.total_second}"> ${count.days}% </progress>
        </div>
      </li>`

    });

    todo_show.innerHTML = todo_list;
}
showAll()
/**
 * local storage check
 */
function loaclStorage() {

    let storage = localStorage.getItem('todo');
    //empty array 
    let todo_arry;
    if (storage == null) {
        todo_arry = [];
       
    } else {
        todo_arry = JSON.parse(storage);
    }

    return todo_arry;
}
/**
 * delete item
 */
function deleteTodo(index) {
    
    let storage = localStorage.getItem('todo');
    let todo_arry = JSON.parse(storage);
    todo_arry.splice(index, 1);
    localStorage.setItem('todo', JSON.stringify(todo_arry));
    showAll();

}
/**
 * work done
 */
function WorkDone(index) {
    let storage = localStorage.getItem('todo');
    let todoArray = JSON.parse(storage);

    todoArray[index].done_work = 1;

    localStorage.setItem('todo', JSON.stringify(todoArray));
    showAll();
    

}

/**
 * clear form
 */
function clear() {
    note_input.value = "";
    client_name_input.value = "";
    date_input.value = "";
    time_input.value = "";

}
/**
 * no task message
 */
function taskCheck() {
    let todo_data = loaclStorage();
    if (todo_data.length == 0) {
        no_task.innerHTML = "Task list empty"
    } else {
        no_task.innerHTML = ""
    }
}

/**
 * pick date check
 */
function pickDateCheck(inputDate) {

    let currentDate = new Date();
    let dateArray = inputDate.split("-")

    if ((dateArray[2]-currentDate.getDate())<0 || (dateArray[1]-currentDate.getMonth())<0 || (dateArray[0]-currentDate.getFullYear())<0 )  {
        return true;
    } else {
        return false;
    }
    
}

function timeCoundown(dateTime='7 18, 2021 2:22:25', done) {
    // "7 18, 2021 2:22:25"
// Set the date we're counting down to
var countDownDate = new Date(dateTime).getTime();




  // Get today's date and time
    var now = new Date().getTime();
    
        if (done == 1) {
            var count = {
                "days" : 0,
                "hours" : 0, 
                "minutes" : 0,
                "seconds": 0,
                "color": "bg-success",
                "totalsecond" : 0
            }
        } else {
            
            var distance = countDownDate - now;
            
            if (distance > 0) {
                let days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var count = {
                    "days" : Math.floor(distance / (1000 * 60 * 60 * 24)),
                    "hours" : Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    "minutes" : Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    "seconds" : Math.floor((distance % (1000 * 60)) / 1000),
                    "totalsecond": Math.floor(distance/1000) ,
                    "color": "",
                }
            } else {
                var count = {
                    "days" : 0,
                    "hours" : 0, 
                    "minutes" : 0,
                    "seconds": 0,
                    "color": "bg-warning",
                    "totalsecond" : 0
                }
            }
        }

   
    
  // Find the distance between now and the count down date
    
    return count;
    

}

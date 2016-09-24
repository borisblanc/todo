console.log("application starting....");



var template;
var tasksCollection = [];
tasksCollection.__proto__.createTask = function(){
	var task = {};
	task.id = this.length;
	task.name = "";
	task.description = "";
	task.priority = 0;
	task.isDone = 0;
	this.push(task);
	return task;
};

function showTasks() {
	console.log(tasksCollection);
}

function popTasks(tasks) {
	var divtasks = document.querySelector('.tasks');

	for (var i = 0; i < tasks.length; i++) {
		var domTaskRow = template.cloneNode(true);
		var task = tasks[i];
		domTaskRow.getElementsByClassName('name')[0].value = task.name;
		domTaskRow.getElementsByClassName('description')[0].value = task.description;
		domTaskRow.getElementsByClassName('priority')[0].value = task.priority;
		domTaskRow.getElementsByClassName('is-done')[0].value = task.isDone;
		divtasks.appendChild(domTaskRow);
		addTaskRowEventListeners(domTaskRow,task);
		tasksCollection[i] = task;
	}
}



function addTaskRowEventListeners(domTaskRow, task) {
	domTaskRow.addEventListener('keyup', function(event){
		var target = event.target;

		if(target.classList.contains('name')){
			task.name = target.value;
		}
		if(target.classList.contains('description')){
			task.description = target.value;
		}
		if(target.classList.contains('priority')){
			task.priority = target.value;
		}
	});

	domTaskRow.addEventListener('change', function(event) {
		var target = event.target;
		if(target.classList.contains('is-done')){
			task.isDone = target.checked;
		}
	});
}

document.addEventListener("DOMContentLoaded", function(event){
	var buttoncreate = document.querySelector('.create-button');
	var buttonsave = document.querySelector('.save-button');
	var tasks = document.querySelector('.tasks');

	//load template
	var html = document.querySelector('#task-template').innerHTML;
	template = document.createElement('div');
	template.innerHTML = html;


	// get data
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/tasks', true);
	xhr.onload = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				console.log(xhr.responseText);
				var tasks = JSON.parse(xhr.responseText);
				popTasks(tasks);
			} else {
				console.error(xhr.statusText);
			}
		}
	};
	xhr.onerror = function () {
		console.error(xhr.statusText);
	};
	xhr.send(null);


	buttoncreate.addEventListener('click', function(){
		var domTaskRow = template.cloneNode(true);
		var task = tasksCollection.createTask();
		addTaskRowEventListeners(domTaskRow, task);
		tasks.appendChild(domTaskRow);
	});


	buttonsave.addEventListener('click', function () {
		if (tasksCollection.length > 0) {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/tasks', true);
			xhr.setRequestHeader("Content-Type", "application/json");

			xhr.onload = function () {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						console.log(xhr.responseText);
					} else {
						console.error(xhr.statusText);
					}
				}
			};
			xhr.onerror = function () {
				console.error(xhr.statusText);
			};

			xhr.send(JSON.stringify(tasksCollection));
		}
	});

/*	tasks
	urls - crud operations on tasks

	GET /tasks
	GET /tasks/id  id of a task to retrieve
	PUT /tasks/id
	DELETE /tasks/id



	POST - creating new tasks
	GET - retrieving existings tasks
	PUT - updating exsitings tasks
	DELETE - deleteing tasks*/



});



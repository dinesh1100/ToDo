const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const repeatSelect = document.getElementById('repeatSelect');

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const today = new Date().toISOString().split('T')[0];
  taskList.innerHTML = '';

  tasks.forEach((task, i) => {
    if (new Date(task.date) < new Date(today)) return; // skip past tasks

    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = task.text;
    const info = document.createElement('small');
    info.textContent = `(${task.date}${task.repeat !== 'none' ? ' - repeats ' + task.repeat : ''})`;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'X';
    delBtn.onclick = () => deleteTask(i);

    li.appendChild(span);
    li.appendChild(info);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  const value = taskInput.value.trim();
  const repeat = repeatSelect.value;
  if (!value) return alert('Enter a task');

  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const today = new Date();

  // Add main task
  tasks.push({
    text: value,
    date: today.toISOString().split('T')[0],
    repeat
  });

  // Add repeating tasks if selected
  if (repeat !== 'none' && repeat !== 'daily') {
    const days = parseInt(repeat);
    for (let i = 1; i < days; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      tasks.push({
        text: value,
        date: d.toISOString().split('T')[0],
        repeat
      });
    }
  }

  if (repeat === 'daily') {
    for (let i = 1; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      tasks.push({
        text: value,
        date: d.toISOString().split('T')[0],
        repeat
      });
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  taskInput.value = '';
  loadTasks();
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

window.onload = loadTasks;

const taskList = document.getElementById('taskList');
const modal = document.getElementById('modal');
const addBtn = document.getElementById('addBtn');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');
const taskInput = document.getElementById('taskInput');
const repeatSelect = document.getElementById('repeatSelect');
const historyBtn = document.getElementById('historyBtn');
const pageTitle = document.getElementById('pageTitle');

let showingHistory = false;

addBtn.onclick = () => (modal.style.display = 'flex');
cancelBtn.onclick = () => (modal.style.display = 'none');
saveBtn.onclick = addTask;
historyBtn.onclick = toggleHistory;

function addTask() {
  const value = taskInput.value.trim();
  const repeat = repeatSelect.value;
  if (!value) return alert('Please enter a task');

  const today = new Date();
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  addTaskWithRepeat(tasks, value, today, repeat);

  localStorage.setItem('tasks', JSON.stringify(tasks));
  modal.style.display = 'none';
  taskInput.value = '';
  loadTasks();
}

function addTaskWithRepeat(tasks, text, startDate, repeat) {
  const today = startDate;
  tasks.push({
    text,
    date: today.toISOString().split('T')[0],
    repeat,
    status: 'pending'
  });

  let days = 0;
  if (repeat === 'daily') days = 30;
  else if (repeat !== 'none') days = parseInt(repeat);

  for (let i = 1; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    tasks.push({
      text,
      date: d.toISOString().split('T')[0],
      repeat,
      status: 'pending'
    });
  }
}

function updateTaskStatus(index, status) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks[index].status = status;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

function toggleHistory() {
  showingHistory = !showingHistory;
  pageTitle.textContent = showingHistory ? 'Task History' : "Today's Tasks";
  historyBtn.textContent = showingHistory ? '🏠' : '📜';
  loadTasks();
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const todayStr = new Date().toISOString().split('T')[0];
  taskList.innerHTML = '';

  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.classList.add(task.status);

    const dateStr = task.date === todayStr ? "Today" : task.date;
    li.innerHTML = `<strong>${task.text}</strong><br><small>${dateStr} (${task.repeat})</small>`;

    if (task.date === todayStr && task.status === 'pending') {
      const actions = document.createElement('div');
      actions.className = 'actions';
      actions.innerHTML = `
        <button class="done-btn">Done</button>
        <button class="cancel-btn">Cancel</button>
      `;
      actions.querySelector('.done-btn').onclick = () => updateTaskStatus(i, 'done');
      actions.querySelector('.cancel-btn').onclick = () => updateTaskStatus(i, 'cancelled');
      li.appendChild(actions);
    }

    // If viewing history, show all days except today
    if (showingHistory && task.date < todayStr) taskList.appendChild(li);
    else if (!showingHistory && task.date === todayStr) taskList.appendChild(li);
  });
}

window.onload = loadTasks;

const addTaskBtn = document.getElementById('addTaskBtn');
const modal = document.getElementById('modal');
const cancelBtn = document.getElementById('cancelBtn');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const taskInput = document.getElementById('taskInput');
const repeatSelect = document.getElementById('repeatSelect');
const taskList = document.getElementById('taskList');

// Modal open/close
addTaskBtn.onclick = () => modal.style.display = 'flex';
cancelBtn.onclick = () => modal.style.display = 'none';

saveTaskBtn.onclick = () => {
  const name = taskInput.value.trim();
  const repeat = repeatSelect.value;

  if (!name) return alert('Please enter a task name.');

  const today = new Date();
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  addTaskWithRepeat(tasks, name, today, repeat);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  taskInput.value = '';
  modal.style.display = 'none';
  loadTasks();
};

function addTaskWithRepeat(tasks, text, startDate, repeat) {
  const today = startDate;
  tasks.push({ text, date: today.toISOString().split('T')[0], status: 'pending', repeat });

  let days = 0;
  if (repeat === 'daily') days = 30;
  else if (repeat !== 'none') days = parseInt(repeat);

  for (let i = 1; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    tasks.push({ text, date: d.toISOString().split('T')[0], status: 'pending', repeat });
  }
}

function updateStatus(index, status) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks[index].status = status;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const today = new Date().toISOString().split('T')[0];
  taskList.innerHTML = '';

  tasks.forEach((task, i) => {
    if (task.date === today) {
      const li = document.createElement('li');
      li.className = task.status;

      li.innerHTML = `
        <span>${task.text}</span>
        <div class="actions">
          ${task.status === 'pending' ? `
            <button class="done-btn" onclick="updateStatus(${i}, 'done')">Done</button>
            <button class="cancel-btn" onclick="updateStatus(${i}, 'cancelled')">Cancel</button>
          ` : ''}
        </div>
      `;

      taskList.appendChild(li);
    }
  });
}

window.onload = loadTasks;

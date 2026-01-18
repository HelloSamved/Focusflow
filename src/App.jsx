import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [editTime, setEditTime] = useState('');

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      alert('Focus session complete! Take a break.');
      setIsRunning(false);
      setTimeLeft(duration * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        text: newTask,
        completed: false,
        estimatedTime: newTaskTime ? parseInt(newTaskTime) : null
      }]);
      setNewTask('');
      setNewTaskTime('');
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditText(tasks[index].text);
    setEditTime(tasks[index].estimatedTime || '');
  };

  const saveEdit = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      text: editText,
      estimatedTime: editTime ? parseInt(editTime) : null
    };
    setTasks(updatedTasks);
    setEditingIndex(null);
  };

  const toggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="app">
      <header>
        <h1>Focus Flow</h1>
        <p>Stay in the flow with timed sessions and task tracking.</p>
      </header>
      <div className="timer-section">
        <div className="timer-settings">
          <label>Session Length</label>
          <div className="duration-input-wrapper">
            <input
              type="number"
              min="1"
              max="120"
              value={duration}
              onChange={(e) => {
                const mins = parseInt(e.target.value) || 0;
                setDuration(mins);
                if (!isRunning) setTimeLeft(mins * 60);
              }}
            />
            <span>min</span>
          </div>
        </div>
        <div className="timer">{formatTime(timeLeft)}</div>
        <div className="timer-controls">
          <button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? 'Pause' : 'Start'} Session
          </button>
          <button onClick={() => { setTimeLeft(duration * 60); setIsRunning(false); }}>Reset</button>
        </div>
      </div>
      <div className="tasks-section">
        <h2>Tasks</h2>
        <div className="task-input-group">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What are you working on?"
            className="task-main-input"
          />
          <div className="task-sub-input">
            <input
              type="number"
              value={newTaskTime}
              onChange={(e) => setNewTaskTime(e.target.value)}
              placeholder="Min (optional)"
              min="1"
            />
            <button onClick={addTask}>Add Task</button>
          </div>
        </div>

        <ul className="task-list">
          {tasks.map((task, index) => (
            <li key={index} className={`task-item ${task.completed ? 'completed' : ''}`}>
              {editingIndex === index ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <input
                    type="number"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    placeholder="Min"
                  />
                  <div className="edit-actions">
                    <button onClick={() => saveEdit(index)}>Save</button>
                    <button onClick={() => setEditingIndex(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="task-content" onClick={() => toggleTask(index)}>
                    <div className={`checkbox ${task.completed ? 'checked' : ''}`}></div>
                    <div className="task-details">
                      <span className="task-text">{task.text}</span>
                      {task.estimatedTime && (
                        <span className="task-time-badge">{task.estimatedTime} min</span>
                      )}
                    </div>
                  </div>
                  <div className="task-actions">
                    <button className="action-btn edit" onClick={() => startEditing(index)} title="Rename">
                      ✎
                    </button>
                    <button className="action-btn delete" onClick={() => removeTask(index)} title="Remove">
                      ✕
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
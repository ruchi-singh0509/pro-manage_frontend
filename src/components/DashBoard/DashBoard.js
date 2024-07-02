import React, { useState, useEffect } from 'react';
import styles from './DashBoard.module.css';
import axios from 'axios';
import moment from 'moment';
import down from '../../assets/Stroke 1.png';
import createBtn from '../../assets/Group 10.png';
import TaskModal from '../TaskModal/TaskModal';
import DeleteModal from '../DeleteModal/DeleteModal';
import dots from '../../assets/dots.png';
import { useClipboard } from 'use-clipboard-copy';
import { toast, ToastContainer } from 'react-toastify';
import closeButton from '../../assets/closebutton.png';
import EditModal from '../Edit-Modal/Edit-Modal';
import 'react-toastify/dist/ReactToastify.css';

const DashBoard = () => {
    const clipboard = useClipboard();
    const [tasks, setTasks] = useState([]);
    const [checklistCompleted, setChecklistCompleted] = useState(0);
    const [checklist, setChecklist] = useState([]);
    const [authorization, setAuthorization] = useState(false);
    const [isOpen, setIsOpen] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [taskState, setTaskState] = useState(tasks.state);
    const [filter, setFilter] = useState('Today');
    const [isMenuOpen, setIsMenuOpen] = useState(null);
    const [openTask, setOpenTask] = useState(false);
    const [isCheck, setIsCheck] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [checklistCompletion, setChecklistCompletion] = useState();

    const token = localStorage.getItem('authToken');

    const notify = () => {
        toast('Link Copied ✅', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low':
                return '#63C05B';
            case 'moderate':
                return '#18B0FF';
            case 'high':
                return '#FF2473';
            default:
                return 'inherit';
        }
    };
    const getDueDateColor = (dueDate, state) => {
        const now = new Date();
        const dueDateObj = new Date(dueDate);
        const diff = dueDateObj - now;
        if (state === 'done') {
            return '#63C05B';
        } else if (diff < 0 || state === 'backlog') {
            return '#CF3636';
        } else {
            return '#DBDBDB';
        }
    };

    useEffect(() => {
        if (token) {
            setAuthorization(true);
        } else {
            setAuthorization(false);
        }
    }, [token]);

    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                const response = await axios.get(
                    'https://pro-manage-backend-zeta.vercel.app/api/getalltask',
                    config
                );
                const tasks = response.data;
                const checklist = tasks.flatMap((task) => task.checklist);
                setTasks(tasks);
                setChecklist(checklist);
                setTaskState(tasks[0]?.state);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTasks();
    }, [taskState, isCheck]);

    const updateTaskState = async (newTaskState, taskId) => {
        const authToken = localStorage.getItem('authToken');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
        };

        try {
            const response = await axios.put(
                `https://pro-manage-backend-zeta.vercel.app/api/update-state//${taskId}`,
                { state: newTaskState },
                config
            );
            setTaskState(response.data.state);
        } catch (error) {
            console.error('Error updating task state:', error);
        }
    };

    const handleFitlerChange = (e) => {
        const newFilter = e.target.value;
        setFilter(newFilter);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
        };
        console.log(config);
        axios
            .get(
                `https://pro-manage-backend-zeta.vercel.app/api/get-filter?filter=${newFilter}`,
                config
            )
            .then((res) => {
                console.log(res.data);
                setTasks(res.data);
            })
            .catch((err) => console.log(err.message));
    };

    const handleDropDown = (taskId) => {
        if (openTask === taskId) {
            setOpenTask(null);
        } else {
            setOpenTask(taskId);
        }
    };

    const handleMenuClick = (taskId) => {
        if (isMenuOpen === taskId) {
            setIsMenuOpen(null);
        } else {
            setIsMenuOpen(taskId);
        }
    };

    const isShareAPISupported = () => {
        return navigator.share !== undefined;
    };

    const handleShare = async (url) => {
        if (isShareAPISupported()) {
            try {
                await navigator.share({
                    title: 'Task',
                    url: url,
                });
            } catch (error) {
                console.error('An error occurred while sharing the task:', error);
            }
        } else {
            notify();
            clipboard(url);
        }
    };

    const handleCheck = async (taskId, checklistId) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const url = `https://pro-manage-backend-zeta.vercel.app/api/tasks/${taskId}/checklists/${checklistId}`;
            const updatedChecklist = { ischeck: !isCheck.ischeck };
            await axios.put(url, updatedChecklist, config);
            setIsCheck((prevChecklist) => ({
                ...prevChecklist,
                ischeck: !prevChecklist.ischeck,
            }));
        } catch (error) {
            console.error('Error toggling checklist:', error.message);
        }
    };

    useEffect(() => {
        console.log(isCheck);
    }, [isCheck]);

    const completed = (taskId) => {
        const task = tasks.find((t) => t._id === taskId);
        return (
            task?.checklist?.reduce((acc, checklist) => acc + checklist.ischeck, 0) ||
            0
        );
    };

    const handleEditClick = (taskId) => {
        setSelectedTaskId(taskId);
        setEditModal(true);
    };

    const handleDeleteClick = (taskId) => {
        setSelectedTaskId(taskId);
        setDeleteModal(true);
    };
    const greetings = `Welcome!  ${localStorage.getItem('Name')}`;

    return (
        <>
            {authorization && (
                <div className={styles.MainContainer}>
                    <div className={styles.DashBoardContainer1}>
                        <div className={styles.DashBoardHeaders}>
                            <h3>{greetings}</h3>
                            <h2>Board</h2>
                        </div>
                        <div className={styles.DashBoardDateheaders}>
                            <h3>{moment().format('Do MMM YYYY')}</h3>
                            <select
                                className={styles.DashBoardSelector}
                                value={filter}
                                onChange={handleFitlerChange}
                            >
                                <option value="today" default>
                                    Today
                                </option>
                                <option value="thisWeek">ThisWeek</option>
                                <option value="thisMonth">ThisMonth</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.DashBoardContainer2}>
                        <div className={styles.TaskBoard}>
                            <div className={styles.Task}>
                                <div className={styles.create}>
                                    <h3>Backlog</h3>
                                    <button>
                                        <img src={closeButton} alt="closebtn" />
                                    </button>
                                </div>
                                <div className={styles.TaskContainer}>
                                    {tasks
                                        .filter((task) => task.state === 'backlog')
                                        .map((task) => (
                                            <div key={task._id} className={styles.TaskCard}>
                                                <div className={styles.dropdownMenu}>
                                                    <div>
                                                        <div
                                                            style={{
                                                                backgroundColor: getPriorityColor(
                                                                    task.priority
                                                                ),
                                                                height: '10px',
                                                                width: '10px',
                                                                borderRadius: '50px',
                                                                content: '',
                                                                position: 'relative',
                                                                top: '21px',
                                                            }}
                                                        ></div>
                                                        <span>
                                                            <p className={styles.TaskPriority}>
                                                                {task.priority?.toUpperCase()} PRIORITY
                                                            </p>
                                                        </span>
                                                    </div>

                                                    <button
                                                        className={styles.dropbtn}
                                                        onClick={(e) => handleMenuClick(task._id)}
                                                    >
                                                        <img src={dots} alt="dots" />
                                                    </button>
                                                </div>
                                                {isMenuOpen === task._id && (
                                                    <div
                                                        id="myDropdown"
                                                        className={styles.dropdownContent}
                                                    >
                                                        <button onClick={() => handleEditClick(task._id)}>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleShare(
                                                                    `https://pro-manage-backend-zeta.vercel.app/task/${task._id}`
                                                                )
                                                            }
                                                        >
                                                            Share
                                                        </button>
                                                        <button
                                                            style={{ color: '#CF3636' }}
                                                            onClick={() => handleDeleteClick(task._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                                <h3>{task.title}</h3>
                                                <div className={styles.TaskCheckList}>
                                                    <h4>
                                                        checklist ({completed(task._id)}/
                                                        {task.checklist?.length || 0})
                                                    </h4>

                                                    <button
                                                        className={styles.dropdown}
                                                        onClick={() => handleDropDown(task._id)}
                                                    >
                                                        <img src={down} alt="down" />
                                                    </button>
                                                </div>
                                                {openTask === task._id && (
                                                    <ul>
                                                        {task.checklist?.map((item, index) => (
                                                            <li key={item._id}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item.ischeck}
                                                                    onChange={(e) =>
                                                                        handleCheck(task._id, item._id)
                                                                    }
                                                                    className={styles.Checklist}
                                                                />
                                                                {item.text}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                <div className={styles.Track}>
                                                    <div
                                                        className={styles.dueDate}
                                                        style={{
                                                            backgroundColor: getDueDateColor(
                                                                task.dueDate,
                                                                task.state
                                                            ),
                                                        }}
                                                    >
                                                        {moment(task.dueDate).format('MMM D')}
                                                    </div>

                                                    <div className={styles.trackbtns}>
                                                        <button
                                                            className={styles.btn}
                                                            value="PROGRESS"
                                                            onClick={() =>
                                                                updateTaskState('in-progress', task._id)
                                                            }
                                                        >
                                                            PROGRESS
                                                        </button>
                                                        <button
                                                            className={styles.btn}
                                                            value="TODO"
                                                            onClick={() => updateTaskState('todo', task._id)}
                                                        >
                                                            TODO
                                                        </button>
                                                        <button
                                                            className={styles.btn}
                                                            value="DONE"
                                                            onClick={() => updateTaskState('done', task._id)}
                                                        >
                                                            DONE
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className={styles.Task}>
                                <div className={styles.create}>
                                    <h3>To do</h3>
                                    <div className={styles.createClose}>
                                        <button onClick={() => setOpenModal(true)}>
                                            <img src={createBtn} alt="btn" />
                                        </button>
                                        <button>
                                            <img src={closeButton} alt="closebtn" />
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.TaskContainer}>
                                    {tasks
                                        .filter((task) => task.state === 'todo')
                                        .map((task) => (
                                            <div key={task._id} className={styles.TaskCard}>
                                                <div className={styles.dropdownMenu}>
                                                    <div>
                                                        <div
                                                            style={{
                                                                backgroundColor: getPriorityColor(
                                                                    task.priority
                                                                ),
                                                                height: '10px',
                                                                width: '10px',
                                                                borderRadius: '50px',
                                                                content: '',
                                                                position: 'relative',
                                                                top: '21px',
                                                            }}
                                                        ></div>
                                                        <span>
                                                            <p className={styles.TaskPriority}>
                                                                {task.priority?.toUpperCase()} PRIORITY
                                                            </p>
                                                        </span>
                                                    </div>

                                                    <button
                                                        className={styles.dropbtn}
                                                        onClick={(e) => handleMenuClick(task._id)}
                                                    >
                                                        <img src={dots} alt="dots" />
                                                    </button>
                                                </div>
                                                {isMenuOpen === task._id && (
                                                    <div
                                                        id="myDropdown"
                                                        className={styles.dropdownContent}
                                                    >
                                                        <button onClick={() => handleEditClick(task._id)}>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleShare(
                                                                    `https://pro-manage-backend-zeta.vercel.app/task/${task._id}`
                                                                )
                                                            }
                                                        >
                                                            Share
                                                        </button>
                                                        <button
                                                            style={{ color: '#CF3636' }}
                                                            onClick={() => handleDeleteClick(task._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                                <h3>{task.title}</h3>
                                                <div className={styles.TaskCheckList}>
                                                    <h4>
                                                        checklist ({completed(task._id)}/
                                                        {task.checklist?.length || 0})
                                                    </h4>

                                                    <button
                                                        className={styles.dropdown}
                                                        onClick={(e) => handleDropDown(task._id)}
                                                        key={task._id}
                                                    >
                                                        <img src={down} alt="down" />
                                                    </button>
                                                </div>
                                                {isOpen ||
                                                    (openTask === task._id && (
                                                        <ul>
                                                            {task.checklist?.map((item, index) => (
                                                                <li key={item._id}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={item.ischeck}
                                                                        onChange={(e) =>
                                                                            handleCheck(task._id, item._id)
                                                                        }
                                                                        className={styles.Checklist}
                                                                    />
                                                                    {item.text}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ))}
                                                <div className={styles.Track}>
                                                    <div
                                                        className={styles.dueDate}
                                                        style={{
                                                            backgroundColor: getDueDateColor(
                                                                task.dueDate,
                                                                task.state
                                                            ),
                                                        }}
                                                    >
                                                        {moment(task.dueDate).format('MMM D')}
                                                    </div>
                                                    <div className={styles.trackbtns}>
                                                        <button
                                                            className={styles.btn}
                                                            value="in-progress"
                                                            onClick={() =>
                                                                updateTaskState('in-progress', task._id)
                                                            }
                                                        >
                                                            PROGRESS
                                                        </button>
                                                        <button
                                                            className={styles.btn}
                                                            value="backlog"
                                                            onClick={() =>
                                                                updateTaskState('backlog', task._id)
                                                            }
                                                        >
                                                            BACKLOG
                                                        </button>
                                                        <button
                                                            className={styles.btn}
                                                            value="done"
                                                            onClick={() => updateTaskState('done', task._id)}
                                                        >
                                                            DONE
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className={styles.Task}>
                                <div className={styles.create}>
                                    <h3>In progress</h3>
                                    <button>
                                        <img src={closeButton} alt="closebtn" />
                                    </button>
                                </div>
                                <div className={styles.TaskContainer}>
                                    {tasks
                                        .filter((task) => task.state === 'in-progress')
                                        .map((task) => (
                                            <div key={task._id} className={styles.TaskCard}>
                                                <div className={styles.dropdownMenu}>
                                                    <div>
                                                        <div
                                                            style={{
                                                                backgroundColor: getPriorityColor(
                                                                    task.priority
                                                                ),
                                                                height: '10px',
                                                                width: '10px',
                                                                borderRadius: '50px',
                                                                content: '',
                                                                position: 'relative',
                                                                top: '21px',
                                                            }}
                                                        ></div>
                                                        <span>
                                                            <p className={styles.TaskPriority}>
                                                                {task.priority?.toUpperCase()} PRIORITY
                                                            </p>
                                                        </span>
                                                    </div>

                                                    <button
                                                        className={styles.dropbtn}
                                                        onClick={(e) => handleMenuClick(task._id)}
                                                    >
                                                        <img src={dots} alt="dots" />
                                                    </button>
                                                </div>
                                                {isMenuOpen === task._id && (
                                                    <div
                                                        id="myDropdown"
                                                        className={styles.dropdownContent}
                                                    >
                                                        <button onClick={() => handleEditClick(task._id)}>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleShare(
                                                                    `https://pro-manage-backend-zeta.vercel.app/task/${task._id}`
                                                                )
                                                            }
                                                        >
                                                            Share
                                                        </button>
                                                        <button
                                                            style={{ color: '#CF3636' }}
                                                            onClick={() => handleDeleteClick(task._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                                <h3>{task.title}</h3>
                                                <div className={styles.TaskCheckList}>
                                                    <h4>
                                                        checklist ({completed(task._id)}/
                                                        {task.checklist?.length || 0})
                                                    </h4>

                                                    <button
                                                        className={styles.dropdown}
                                                        onClick={(e) => handleDropDown(task._id)}
                                                        key={task._id}
                                                    >
                                                        <img src={down} alt="down" />
                                                    </button>
                                                </div>
                                                {openTask === task._id && (
                                                    <ul>
                                                        {task.checklist?.map((item, index) => (
                                                            <li key={index._id}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item.ischeck}
                                                                    onChange={(e) =>
                                                                        handleCheck(task._id, item._id)
                                                                    }
                                                                    className={styles.Checklist}
                                                                />
                                                                {item.text}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                <div className={styles.Track}>
                                                    <div
                                                        className={styles.dueDate}
                                                        style={{
                                                            backgroundColor: getDueDateColor(
                                                                task.dueDate,
                                                                task.state
                                                            ),
                                                        }}
                                                    >
                                                        {moment(task.dueDate).format('MMM D')}
                                                    </div>
                                                    <div className={styles.trackbtns}>
                                                        <button
                                                            className={styles.btn}
                                                            onClick={() =>
                                                                updateTaskState('backlog', task._id)
                                                            }
                                                        >
                                                            BACKLOG
                                                        </button>
                                                        <button
                                                            className={styles.btn}
                                                            onClick={() => updateTaskState('todo', task._id)}
                                                        >
                                                            TODO
                                                        </button>
                                                        <button
                                                            className={styles.btn}
                                                            onClick={() => updateTaskState('done', task._id)}
                                                        >
                                                            DONE
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className={styles.Task}>
                                <div className={styles.create}>
                                    <h3>Done</h3>
                                    <button>
                                        <img src={closeButton} alt="closebtn" />
                                    </button>
                                </div>
                                <div className={styles.TaskContainer}>
                                    {tasks
                                        .filter((task) => task.state === 'done')
                                        .map((task) => (
                                            <div key={task._id} className={styles.TaskCard}>
                                                <div className={styles.dropdownMenu}>
                                                    <div>
                                                        <div
                                                            style={{
                                                                backgroundColor: getPriorityColor(
                                                                    task.priority
                                                                ),
                                                                height: '10px',
                                                                width: '10px',
                                                                borderRadius: '50px',
                                                                content: '',
                                                                position: 'relative',
                                                                top: '21px',
                                                            }}
                                                        ></div>
                                                        <span>
                                                            <p className={styles.TaskPriority}>
                                                                {task.priority?.toUpperCase()} PRIORITY
                                                            </p>
                                                        </span>
                                                    </div>

                                                    <button
                                                        className={styles.dropbtn}
                                                        onClick={(e) => handleMenuClick(task._id)}
                                                    >
                                                        <img src={dots} alt="dots" />
                                                    </button>
                                                </div>
                                                {isMenuOpen === task._id && (
                                                    <div
                                                        id="myDropdown"
                                                        className={styles.dropdownContent}
                                                    >
                                                        <button onClick={() => handleEditClick(task._id)}>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleShare(
                                                                    `https://pro-manage-backend-zeta.vercel.app/task/${task._id}`
                                                                )
                                                            }
                                                        >
                                                            Share
                                                        </button>
                                                        <button
                                                            style={{ color: '#CF3636' }}
                                                            onClick={() => handleDeleteClick(task._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                                <h3>{task.title}</h3>
                                                <div className={styles.TaskCheckList}>
                                                    <h4>
                                                        checklist ({completed(task._id)}/
                                                        {task.checklist?.length || 0})
                                                    </h4>

                                                    <button
                                                        className={styles.dropdown}
                                                        onClick={(e) => handleDropDown(task._id)}
                                                        key={task._id}
                                                    >
                                                        <img src={down} alt="down" />
                                                    </button>
                                                </div>
                                                {openTask === task._id && (
                                                    <ul>
                                                        {task.checklist?.map((item, index) => (
                                                            <li key={index._id}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item.ischeck}
                                                                    onChange={(e) =>
                                                                        handleCheck(task._id, item._id)
                                                                    }
                                                                    className={styles.Checklist}
                                                                />
                                                                {item.text}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                <div className={styles.Track}>
                                                    <div
                                                        className={styles.dueDate}
                                                        style={{
                                                            backgroundColor: getDueDateColor(
                                                                task.dueDate,
                                                                task.state
                                                            ),
                                                        }}
                                                    >
                                                        {moment(task.dueDate).format('MMM D')}
                                                    </div>
                                                    <div className={styles.trackbtns}>
                                                        <button
                                                            className={styles.btn}
                                                            onClick={() =>
                                                                updateTaskState('backlog', task._id)
                                                            }
                                                        >
                                                            BACKLOG
                                                        </button>
                                                        <button
                                                            className={styles.btn}
                                                            onClick={() => updateTaskState('todo', task._id)}
                                                        >
                                                            TODO
                                                        </button>
                                                        <button
                                                            className={styles.btn}
                                                            onClick={() =>
                                                                updateTaskState('in-progress', task._id)
                                                            }
                                                        >
                                                            PROGRESS
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {tasks.map(
                (task) =>
                    deleteModal && (
                        <DeleteModal
                            key={task._id}
                            closeModal={setDeleteModal}
                            taskId={selectedTaskId}
                        />
                    )
            )}
            <ToastContainer />
            {tasks.map(
                (task) =>
                    editModal && (
                        <EditModal
                            key={task._id}
                            closeModal={setEditModal}
                            taskId={selectedTaskId}
                        />
                    )
            )}

            {openModal && <TaskModal closeModal={setOpenModal} />}

            {!authorization && <p> Please login or register to access this page !</p>}
        </>
    );
};

export default DashBoard;
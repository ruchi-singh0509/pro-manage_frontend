import React, { useState, useEffect } from 'react';
import styles from './TaskPage.module.css';
import axios from 'axios';
import moment from 'moment';
import Logo from '../../assets/Logo.png';
import { useParams } from 'react-router-dom';

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [checklist, setChecklist] = useState([]);
    const [checklistCompleted, setChecklistCompleted] = useState(0);
    const [isShow, setIsShow] = useState(false);

    const { id } = useParams();

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
        const fetchData = async () => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            };

            try {
                const response = await axios.get(
                    `https://pro-manage-backend-zeta.vercel.app/api/gettaskbyid/${id}`,
                    config
                );

                setTasks(response.data);
                console.log(response.data);
                setChecklist(response.data.checklist.map((item) => ({ ...item })));
                setIsShow(response.data.state);
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const state = tasks.state;
        console.log(state);
        if (tasks.state === 'backlog') {
            return setIsShow(true);
        } else if (tasks.state === 'done') {
            return setIsShow(false);
        }
    }, [tasks.state]);

    return (
        <>
            <div
                style={{ marginTop: '20px', marginLeft: '20px', marginRight: '20px' }}
            >
                <img src={Logo} alt="ProManageLoge" className={styles.logo} />
                <div className={styles.TaskPagecontainer}>
                    <div className={styles.TaskPage}>
                        {tasks && (
                            <div key={tasks._id} className={styles.TaskCard}>
                                <div
                                    style={{
                                        backgroundColor: getPriorityColor(tasks.priority),
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
                                        {tasks.priority?.toUpperCase()} PRIORITY
                                    </p>
                                </span>
                                <h3>{tasks.title}</h3>
                                <div className={styles.TaskCheckList}>
                                    <h4>
                                        checklist ({checklistCompleted}/
                                        {tasks.checklist?.length || 0})
                                    </h4>
                                </div>

                                <ul>
                                    {tasks.checklist?.map((item, index) => (
                                        <li key={item._id}>
                                            <input
                                                type="checkbox"
                                                checked={item.ischeck}
                                                className={styles.Checklist}
                                                readOnly
                                            />
                                            {item.text}
                                        </li>
                                    ))}
                                </ul>

                                <div className={styles.Track}>
                                    {isShow && (
                                        <>
                                            <h4>Due Date</h4>
                                            <div
                                                className={styles.dueDate}
                                                style={{
                                                    backgroundColor: getDueDateColor(
                                                        tasks.dueDate,
                                                        tasks.state
                                                    ),
                                                }}
                                            >
                                                {moment(tasks.dueDate).format('MMM D')}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TaskPage;
import React, { useState, useEffect } from 'react';
import styles from './Analytics.module.css';
import axios from 'axios';
import disc from '../../assets/Ellipse.png';

const Analytics = () => {
    const [task, setTask] = useState([]);

    const fetchTask = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            };
            const res = await axios.get(
                'https://pro-manage-backend-zeta.vercel.app/api/getalltask',
                config
            );
            setTask(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTask();
    }, []);

    const getStateCounts = () => {
        const stateCounts = {
            todo: 0,
            InProgress: 0,
            done: 0,
            backlog: 0,
        };
        task.forEach((task) => {
            if (task.state === 'todo') {
                stateCounts.todo++;
            } else if (task.state === 'in-progress') {
                stateCounts.InProgress++;
            } else if (task.state === 'done') {
                stateCounts.done++;
            } else if (task.state === 'backlog') {
                stateCounts.backlog++;
            }
        });
        return stateCounts;
    };

    const getPriorityCounts = () => {
        const priorityCounts = {
            low: 0,
            moderate: 0,
            high: 0,
        };
        task.forEach((task) => {
            if (task.priority === 'low') {
                priorityCounts.low++;
            } else if (task.priority === 'moderate') {
                priorityCounts.moderate++;
            } else if (task.priority === 'high') {
                priorityCounts.high++;
            }
        });
        return priorityCounts;
    };

    const getDueDateCounts = () => {
        const pastDueDateCounts = {
            DueDate: 0,
        };
        const now = new Date();
        task.forEach((task) => {
            if (task.dueDate) {
                const dueDate = new Date(task.dueDate);
                if (dueDate < now) {
                    pastDueDateCounts.DueDate++;
                }
            }
        });
        return pastDueDateCounts;
    };

    return (
        <>
            <div className={styles.AnalyticsContainer}>
                <h3>Analytics</h3>
                <div className={styles.Analytics}>
                    <div className={styles.Tasks}>
                        <ul className={styles.TasksLists}>
                            {Object.entries(getStateCounts()).map(([state, count]) => (
                                <li key={state}>
                                    <li>
                                        <img
                                            src={disc}
                                            alt="disc"
                                            style={{ marginRight: '10px' }}
                                        />
                                        {state} Tasks
                                    </li>
                                    <li style={{ fontWeight: '600' }}>{count}</li>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.Priority}>
                        <ul className={styles.PriorityLists}>
                            {Object.entries(getPriorityCounts()).map(([priority, count]) => (
                                <li key={priority}>
                                    <li>
                                        <img
                                            src={disc}
                                            alt="disc"
                                            style={{ marginRight: '10px' }}
                                        />
                                        {priority} Priority
                                    </li>
                                    <li style={{ fontWeight: '600' }}>{count}</li>
                                </li>
                            ))}
                            {Object.entries(getDueDateCounts()).map(([dueDate, count]) => (
                                <li key={dueDate}>
                                    <li>
                                        <img
                                            src={disc}
                                            alt="disc"
                                            style={{ marginRight: '10px' }}
                                        />
                                        {dueDate}
                                    </li>
                                    <li style={{ fontWeight: '600' }}>{count}</li>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Analytics;
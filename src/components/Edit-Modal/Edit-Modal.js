import React, { useState, useEffect } from 'react';
import styles from './Edit-Modal.module.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Delete from '../../assets/Delete.png';

const EditsModal = ({ closeModal, taskId }) => {
    const [tasks, setTasks] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        priority: 'low',
        dueDate: new Date(),
        user: localStorage.getItem('id'),
        checklist: [{ text: '', ischecked: false }],
        state: 'todo',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await axios.get(
                    `https://pro-manage-backend-zeta.vercel.app/api/gettaskbyid/${taskId}`
                );
                setTasks(res.data);
                setFormData(res.data);
            } catch (error) {
                console.error('Error fetching task:', error);
            }
        };

        if (taskId) {
            fetchTask();
        }
    }, [setTasks, taskId]);

    const handleChange = (e, i) => {
        if (i !== undefined) {
            const newValues = [...formData.checklist];
            newValues[i] = {
                ...newValues[i],
                text: e.target.value,
                ischecked: e.target.checked,
                priority: e.target.value,
            };
            setFormData({ ...formData, checklist: newValues });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            };

            // Validate formData before sending the request
            const errors = validateFormData(formData);
            if (Object.keys(errors).length > 0) {
                setErrors(errors);
                return;
            }

            const response = await axios.put(
                `https://pro-manage-backend-zeta.vercel.app/api/edit-task/${taskId}`,
                formData,
                config
            );
            console.log(response.data);
            window.location.reload();
            closeModal(false);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ global: error.message });
            }
        }
    };

    const handleDelete = (e, index) => {
        e.preventDefault();
        const newChecklist = [...formData.checklist];
        newChecklist.splice(index, 1);
        const newFormData = {
            ...formData,
            checklist: newChecklist,
        };
        setFormData(newFormData);
    };

    const handleAdd = (e) => {
        e.preventDefault();
        setFormData((prevFormData) => ({
            ...prevFormData,
            checklist: [...prevFormData.checklist, { text: '', ischecked: false }],
        }));
    };
    // Add validation function
    const validateFormData = (data) => {
        const errors = {};

        if (!data.title) {
            errors.title = 'Title is required';
        }

        if (!data.dueDate) {
            errors.dueDate = 'Due date is required';
        }

        return errors;
    };

    return (
        <>
            <div className={styles.modalBackground}>
                <div className={styles.modalContainer}>
                    <form className={styles.modal}>
                        <label className={styles.star}>Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter Task title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                        {errors.title && <p className={styles.error}>{errors.title}</p>}

                        <div className={styles.Priorty}>
                            <label className={styles.star}> Select Priority</label>
                            <button
                                value="high"
                                name="priority"
                                onClick={(e) => handleChange(e)}
                                type="button"
                                className={formData.priority === 'high' ? styles.active : ''}
                            >
                                HIGH PRIORITY
                            </button>
                            <button
                                value="moderate"
                                name="priority"
                                onClick={(e) => handleChange(e)}
                                type="button"
                                className={
                                    formData.priority === 'moderate' ? styles.active : ''
                                }
                            >
                                MODERATE PRIORITY
                            </button>{' '}
                            <button
                                value="low"
                                name="priority"
                                onClick={(e) => handleChange(e)}
                                type="button"
                                className={formData.priority === 'low' ? styles.active : ''}
                            >
                                {' '}
                                LOW PRIORITY{' '}
                            </button>{' '}
                        </div>

                        {/* <h4 className={styles.star}>checklist (/)</h4> */}
                        <div className={styles.AddArea}>
                            {formData.checklist?.map((val, i) => (
                                <div className={styles.addTaskcontainer} key={i}>
                                    <div className={styles.TaskInput}>
                                        <input
                                            type="checkbox"
                                            name="ischecked"
                                            checked={val.ischecked}
                                            value={val.ischecked}
                                            className={styles.addTaskCheckbox}
                                            onChange={(e) => handleChange(e, i)}
                                        />
                                        <input
                                            type="text"
                                            name="text"
                                            value={val.text}
                                            onChange={(e) => handleChange(e, i)}
                                            placeholder="Add a task"
                                            className={styles.addTaskTitle}
                                        />
                                    </div>
                                    <button
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            marginRight: '10px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={(e) => handleDelete(e, i)}
                                    >
                                        <img src={Delete} alt="Delete" />
                                    </button>
                                </div>
                            ))}
                            <button className={styles.addButton} onClick={handleAdd}>
                                + Add New
                            </button>
                        </div>
                        <div className={styles.footer}>
                            <div>
                                <label htmlFor="dueDate"></label>
                                <DatePicker
                                    selected={formData.dueDate}
                                    onChange={(date) =>
                                        handleChange({ target: { name: 'dueDate', value: date } })
                                    }
                                    required
                                />
                                {errors.dueDate && (
                                    <p className={styles.error}>{errors.dueDate}</p>
                                )}
                            </div>
                            <div className={styles.btns}>
                                <button
                                    className={styles.cancel}
                                    type="button"
                                    onClick={() => {
                                        closeModal(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.Save}
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                    {/* <p> Under process</p> */}
                    {/* <button
            className={styles.cancel}
            type="button"
            onClick={() => {
              closeModal(false);
            }}
          >
            Cancel
          </button> */}
                </div>
            </div>
        </>
    );
};

export default EditsModal;
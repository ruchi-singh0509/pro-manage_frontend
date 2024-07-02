import React, { useState, useEffect } from 'react';
import styles from './TaskModal.module.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Delete from '../../assets/Delete.png';

const TaskModal = ({ closeModal }) => {
    const [formData, setFormData] = useState({
        title: '',
        priority: 'low',
        dueDate: new Date(),
        user: localStorage.getItem('id'),
        checklist: [{ text: '', isChecked: false }],
        state: 'todo',
    });
    const { title, dueDate } = formData;

    const [checkItems, setCheckItems] = useState([
        { text: '', isChecked: false },
    ]);

    const handleChange = (e, index) => {
        if (index !== undefined) {
            const updatedCheckItems = [...checkItems];
            const updatedCheckItem = {
                ...updatedCheckItems[index],
                [e.target.name]: e.target.value,
            };
            updatedCheckItems[index] = updatedCheckItem;
            setCheckItems(updatedCheckItems);
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            };
            const response = await axios.post(
                'https://pro-manage-backend-zeta.vercel.app/api/createtask',
                { ...formData, checklist: checkItems },
                config
            );
            window.location.reload();
            closeModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = (index) => {
        const updatedCheckItems = [...checkItems];
        updatedCheckItems.splice(index, 1);
        setCheckItems(updatedCheckItems);
    };

    const handleAdd = () => {
        setCheckItems([...checkItems, { text: '', isChecked: false }]);
    };

    return (
        <>
            <div className={styles.modalBackground}>
                <div className={styles.modalContainer}>
                    <form className={styles.modal} onSubmit={handleSubmit}>
                        <label className={styles.star}>Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter Task title"
                            value={title}
                            onChange={(e) => handleChange(e)}
                            required
                        />

                        <div className={styles.Priorty}>
                            <label className={styles.star}> Select Priority</label>
                            <button
                                value="high"
                                name="priority"
                                onClick={(e) => handleChange(e)}
                                type="button"
                            >
                                HIGH PRIORITY
                            </button>
                            <button
                                value="moderate"
                                name="priority"
                                onClick={(e) => handleChange(e)}
                                type="button"
                            >
                                MODERATE PRIORITY
                            </button>
                            <button
                                value="low"
                                name="priority"
                                onClick={(e) => handleChange(e)}
                                type="button"
                            >
                                LOW PRIORITY
                            </button>
                        </div>

                        <div className={styles.addArea}>
                            {checkItems.map((item, index) => (
                                <div className={styles.addTaskcontainer} key={index}>
                                    <div className={styles.TaskInput}>
                                        <input
                                            type="checkbox"
                                            name="isChecked"
                                            checked={item.isChecked}
                                            value={item.isChecked}
                                            className={styles.addTaskCheckbox}
                                            onChange={(e) => handleChange(e, index)}
                                        />
                                        <input
                                            type="text"
                                            name="text"
                                            value={item.text}
                                            onChange={(e) => handleChange(e, index)}
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
                                        onClick={() => handleDelete(index)}
                                    >
                                        <img src={Delete} alt="Delete" />
                                    </button>
                                </div>
                            ))}
                            <button className={styles.addButton} onClick={handleAdd}>
                                Add New
                            </button>
                        </div>

                        <div className={styles.footer}>
                            <div>
                                <label htmlFor="dueDate"></label>
                                <DatePicker
                                    selected={dueDate}
                                    onChange={(date) =>
                                        handleChange({ target: { name: 'dueDate', value: date } })
                                    }
                                    required
                                />
                            </div>
                            <div className={styles.btns}>
                                <button
                                    className={styles.cancel}
                                    type="button"
                                    onClick={() => closeModal(false)}
                                >
                                    Cancel
                                </button>
                                <button className={styles.Save} type="submit">
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default TaskModal;
import React, { useState } from 'react';
import UpdateEditor from './UpdateEditor';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../store/AuthContext';
import { RiDeleteBinLine } from 'react-icons/ri';
import { MdAddCircleOutline, MdOutlinePersonAddAlt } from 'react-icons/md';
import AddJournal from './AddJournal';
import Journal from '../../services/journalService';
import { toast } from 'react-toastify';
import DeleteJournal from './DeleteJournal';

function AddEditor() {
    const [modalShow, setModalShow] = useState(false);
    const [show, setShow] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { journalData, getJournalData, token } = useAuth();

    const handleRemoveEditor = async (journalId) => {
        const confirmation = confirm('Are you sure you want to remove this editor?');
        if (confirmation) {
            const response = await Journal.removeEditor(journalId, token);
            if (response.success) {
                getJournalData();
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } else {
            return;
        }
    }

    return (
        // Display the list of journals with their respective editors
        <div className='container bg-white p-4 table-responsive mt-3'>
            <div className="d-flex justify-content-evenly flex-wrap">
                <h2 className='fw-bold'>List of Journals and Editors</h2>
                <div className='d-flex flex-wrap'>
                    <Button variant='primary' className='d-flex align-items-center fs-5 fw-semibold mx-2' onClick={() => setShow(true)}>
                        <MdAddCircleOutline className='me-2' />
                        Add Journal
                    </Button>

                    {/* Modal: Add journal */}
                    <AddJournal show={show} handleClose={() => setShow(false)} getJournalData={getJournalData} token={token} />

                    <Button variant='danger' className='d-flex align-items-center fs-5 fw-semibold' onClick={() => setShowDeleteModal(true)}>
                        <RiDeleteBinLine className='me-2' />
                        Delete Journal
                    </Button>

                    <DeleteJournal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} journalData={journalData} getJournalData={getJournalData} />
                </div>
            </div>
            <hr />
            <table className='table table-bordered table-striped text-center'>
                <thead className='table-dark'>
                    <tr>
                        <th>#</th>
                        <th>Journal</th>
                        <th>Editor Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {journalData.map((journal, index) => (
                        <tr key={index}>
                            <th>{index + 1}</th>
                            <td style={{ width: "50rem" }}>{journal.title}</td>
                            <td>{journal.editor ? journal.editor.firstName + " " + journal.editor.lastName : "Not Assigned"}</td>
                            <td>
                                <div className="d-flex justify-content-center flex-wrap">
                                    {/* Modal Button: For update the existing editors */}
                                    <Button
                                        variant='outline-primary'
                                        className='mx-2 d-flex justify-content-center align-items-center fs-5 my-1'
                                        onClick={() => setModalShow(index, true)}
                                    >
                                        <MdOutlinePersonAddAlt />
                                    </Button>

                                    {/* Modal: Update the existing editors */}
                                    <UpdateEditor show={modalShow === index} handleClose={() => setModalShow(index, false)} journal={journal} getJournalData={getJournalData} token={token} />

                                    {/* Remove a existing editor */}
                                    <Button
                                        variant='danger'
                                        className='d-flex justify-content-center align-items-center fs-5 my-1'
                                        onClick={() => handleRemoveEditor(journal._id)}
                                        disabled={!journal.editor}
                                    >
                                        <RiDeleteBinLine />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AddEditor;
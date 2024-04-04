import Reviewer from '../../services/reviewerService';
import { toast } from 'react-toastify';
import { useAuth } from '../../store/AuthContext';
import { useEffect, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import CSVReader from 'react-csv-reader';
import mailService from '../../services/mailService';
import { MdAddCircleOutline } from 'react-icons/md';
import { ColorRing } from 'react-loader-spinner';

function AddReviewer() {
    const { token } = useAuth();
    const [reviewerList, setReviewerList] = useState([{}]);
    const [reviewers, setReviewers] = useState([{}]);
    const [loader1, setLoader1] = useState(false);
    const [loader2, setLoader2] = useState(false);

    /**
     * Handles the form submission for adding a reviewer.
     * 
     * @param {Event} e - The form submit event.
     * @returns {Promise<void>} - A promise that resolves when the submission is handled.
     */
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setLoader1(true);
        const responseData = await Reviewer.addReviewer({
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            email: e.target.email.value,
            affiliation: e.target.affiliation.value
        }, token);
        if (responseData.success) {
            await mailService.sendMail({
                mailFrom: "Journal Submission",
                mailTo: e.target.email.value,
                mailSubject: "Reviewer Update",
                mailHtml: `<div>
                    <h4>Hello ${e.target.firstName.value},</h4>
                    <p>You have been added as a reviewer for reviewing articles. <a href=${window.location.origin + "/sign-up"}>Register</a> or <a href=${window.location.origin + "/login"}>login</a> to start reviewing articles.</p>
                </div>`
            });
            toast.success(responseData.message);
            getReviewerList();
        } else {
            toast.error(responseData.message);
        }
        e.target.reset();
        setLoader1(false);
    }

    /**
     * Fetches the list of reviewers.
     * @returns {Promise<void>} A promise that resolves when the reviewer list is fetched.
     */
    const getReviewerList = async () => {
        const responseData = await Reviewer.getReviewerList(token);
        if (responseData.success) {
            setReviewerList(responseData.data);
        } else {
            toast.error(responseData.message);
        }
    }

    const deleteReviewer = async (reviewerId) => {
        const responseData = await Reviewer.deleteReviewer(reviewerId, token);
        if (responseData.success) {
            toast.success(responseData.message);
            getReviewerList();
        } else {
            toast.error(responseData.message);
        }
    }

    const handleCSVSubmit = async (e) => {
        e.preventDefault();
        console.log(reviewers);
        e.target.reset();
    }

    useEffect(() => {
        getReviewerList();
    }, []);

    return (
        <div className='p-3'>
            <h2 className="text-center fw-bold">Add Reviewer</h2>
            <hr />
            <form className='border p-3' onSubmit={handleOnSubmit}>
                <div className="table-responsive">
                    <table className="table table-bordered text-center">
                        <thead>
                            <tr>
                                <th><label htmlFor="first-name">First Name</label></th>
                                <th><label htmlFor="last-name">Last Name</label></th>
                                <th><label htmlFor="email">Email</label></th>
                                <th><label htmlFor="affiliation">Affiliation</label></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ width: '15rem' }}
                                        name='firstName'
                                        id='first-name'
                                        placeholder='Enter First Name'
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ width: '15rem' }}
                                        name='lastName'
                                        id='last-name'
                                        placeholder='Enter Last Name'
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        type="email"
                                        className="form-control"
                                        style={{ width: '15rem' }}
                                        name='email'
                                        id='email'
                                        placeholder='Enter Email'
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ width: '15rem' }}
                                        name='affiliation'
                                        id='affiliation'
                                        placeholder='Enter Affiliation'
                                        required
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary px-3 fw-bold d-flex align-items-center" style={{minWidth: "10rem"}}>
                        {loader1 ? <ColorRing height={28} width={28} colors={['#fff', '#fff', '#fff', '#fff', '#fff']} wrapperClass='me-1' /> : <MdAddCircleOutline className='me-2 fs-5' />}
                        Add Reviewer
                    </button>
                </div>
            </form>
            <form className="row mt-5 mx-3 border p-3 rounded-2" onSubmit={handleCSVSubmit}>
                <label htmlFor="reviewer-file" className='col-md-2 col-form-label fs-5 fw-bold mb-2' style={{width: "15rem"}}>Upload CSV File</label>
                <div className="col-md-8 d-flex align-items-center mb-3">
                    {/* <input type="file" accept='.csv' id='reviewer-file' className='form-control' /> */}
                    <CSVReader
                        parserOptions={{ header: true }}
                        onFileLoaded={(data, fileInfo) => setReviewers(data)}
                        inputId='reviewer-file'
                    />
                </div>
                <button className="btn btn-primary col-md-2 fw-bold d-flex align-items-center justify-content-center" style={{minWidth: "10rem"}}>
                    {loader2 ? <ColorRing height={28} width={28} colors={['#fff', '#fff', '#fff', '#fff', '#fff']} wrapperClass='me-1' /> : <MdAddCircleOutline className='me-2 fs-5' />}
                    Add Reviewer
                </button>
            </form>
            <h2 className="text-center mt-4 fw-bold">List of Reviewers</h2>
            <hr />
            <div className="table-responsive">
                <table className='table table-bordered text-center table-responsive'>
                    <thead className='table-dark'>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Affiliation</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviewerList.map((reviewer, index) => (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{reviewer.firstName} {reviewer.lastName}</td>
                                <td>{reviewer.email}</td>
                                <td>{reviewer.affiliation}</td>
                                <td>
                                    <button
                                        type='button'
                                        className='btn btn-outline-danger'
                                        onClick={() => deleteReviewer(reviewer._id)}
                                    >
                                        <RiDeleteBinLine />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AddReviewer;
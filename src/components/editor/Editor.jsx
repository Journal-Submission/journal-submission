import React, { useEffect, useState } from "react";
// import { MdAdminPanelSettings } from "react-icons/md";
import { GrView } from "react-icons/gr";
import "./editor.css";
import { useAuth } from "../../store/AuthContext";
import JournalArticle from "../../services/journalAService";
import { toast } from "react-toastify";
import Reviewer from "../../services/reviewerService";
import EditorArticleView from "./EditorArticleView";
import { Button } from "react-bootstrap";

function Editor() {
    const { getArticles, journalData, user, token } = useAuth();
    const [articles, setArticles] = useState([]);
    const [article, setArticle] = useState(false);
    const [reviewers, setReviewers] = useState([]);
    const [tempReviewers, setTempReviewers] = useState([]);
    const [selectedReviewers, setSelectedReviewers] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [search, setSearch] = useState("");

    /**
     * Handles the submission of the selected reviewers.
     * @param {Event} e - The event object.
     * @returns {Promise<void>} - A promise that resolves when the reviewers are updated.
     */
    const handleSubmitReviewer = async (e) => {
        e.preventDefault();
        // Assign the selected reviewers to the article
        if (selectedReviewers.length === 0) {
            toast.error("Please select at least one reviewer");
            return;
        }
        article.reviewers = selectedReviewers.map(reviewer => ({ email: reviewer }));
        // Update the article with the selected reviewers
        const response = await JournalArticle.updateArticle(article, token);
        // If the update is successful, show a success message
        if (response.success) {
            toast.success("Reviewers updated successfully");
        } else {
            // If the update is not successful, show an error message
            toast.error(response.message);
        }
    }

    /**
     * Handles the selection of a reviewer.
     * @param {Event} e - The event object.
     */
    const handleSelectReviewer = (e) => {
        // Check if the reviewer is selected
        const selectedReviewer = e.target.checked;

        // Find the email of the selected reviewer
        const email = reviewers.find(reviewer => reviewer._id === e.target.id).email;

        if (selectedReviewers.length >= 3 && selectedReviewer) {
            toast.error("You can only select 3 reviewers");
            e.target.checked = false;
            return;
        }

        // If the reviewer is selected, add the reviewer's email to the selectedReviewers array
        if (selectedReviewer) {
            selectedReviewers.push(email);
        } else {
            // If the reviewer is deselected, remove the reviewer's email from the selectedReviewers array
            const index = selectedReviewers.indexOf(email);
            selectedReviewers.splice(index, 1);
        }
    }

    /**
     * Handles the submission of the article status update.
     * @param {Event} e - The event object.
     * @returns {Promise<void>} - A promise that resolves when the status update is handled.
     */
    const handleSubmitStatus = async (e) => {
        e.preventDefault();
        // Update the article status with the provided token
        const response = await JournalArticle.updateArticle(article, token);
        if (response.success) {
            toast.success("Status updated successfully");
            getJournalArticles();
        } else {
            toast.error(response.message);
        }
    };

    /**
     * Retrieves journal articles for the current user.
     * @returns {Promise<void>} A Promise that resolves when the articles are retrieved.
     */
    const getJournalArticles = async () => {
        /**
         * Finds the journal ID based on the editor ID.
         *
         * @param {Object[]} journalData - The array of journals.
         * @param {string} user._id - The editor ID.
         * @returns {string} The journal ID.
         */
        const { _id: journalId } = journalData.find((journal) => journal.editorId === user._id);
        const response = await getArticles(journalId);
        if (response.success) {
            setArticles(response.data);
        }
    }

    /**
     * Fetches the list of reviewers.
     * @returns {Promise<void>} A Promise that resolves when the list of reviewers is fetched.
     */
    const getReviewers = async () => {
        // To get the list of reviewers
        const response = await Reviewer.getReviewerList(token);
        if (response.success) {
            setReviewers(response.data);
            setTempReviewers(response.data);
        }
    }

    useEffect(() => {
        // Call the function to get the articles
        getJournalArticles();
        // Call the function to get the list of reviewers
        getReviewers();
    }, [])

    const handleClick = (event) => {
        // Retrieve the ID of the clicked row
        const selectedRowId = event.currentTarget.id;
        // Toggle the selection state of the clicked row
        const updatedArticles = articles.map(article => {
            if (article._id === selectedRowId) {
                return { ...article, isSelected: !article.isSelected };
            } else {
                return { ...article, isSelected: false };
            }
        });
        // If the clicked row is selected, set the article state to the selected article
        if (updatedArticles.find((article) => article._id === selectedRowId).isSelected) {
            const selectedArticle = updatedArticles.find((article) => article._id === selectedRowId);
            setArticle(selectedArticle);
            const filteredReviewers = tempReviewers.filter(reviewer => !selectedArticle.reviewers.some(r => r.email === reviewer.email));
            setReviewers(filteredReviewers);
            setSelectedReviewers(selectedArticle.reviewers.map(reviewer => reviewer.email));
        } else {
            // If the clicked row is deselected, set the article state to false
            setArticle(false);
        }

        // Update the state with the modified articles array
        setArticles(updatedArticles);
        // console.log(article.title);
    };


    const statusChange = (e) => {
        setArticle({ ...article, status: e.target.value });
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
        const searchValue = e.target.value.toLowerCase();
        const filteredReviewers = tempReviewers.filter(reviewer => {
            return reviewer.firstName.toLowerCase().includes(searchValue) || reviewer.lastName.toLowerCase().includes(searchValue);
        });
        setReviewers(filteredReviewers);
    }

    return (
        <section className="editor">
            <div className="editor-container">
                {/* <div className="editor-heading logo d-flex align-items-center bg-light rounded-1">
                    <h5 className="py-1 mx-2 my-3 fs-2">
                        <span className="text-danger">Welcome,</span> {user.firstName}
                    </h5>
                    <MdAdminPanelSettings size={40} color="#8B3DFF" />
                </div> */}
                <hr className="my-0" />
                <div className="editor-form">
                    <div className="row m-0 p-0">
                        {/* Editor journal-title */}

                        <div className={`col-md-9 ${!article && 'col-md-12'}`}>
                            <table className="table table-striped table-bordered text-center">
                                <thead className="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Created At</th>
                                        <th>View details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles.map((article, index) => (
                                        <tr key={index} onClick={handleClick} id={article._id} className={article.isSelected ? "table-primary" : ""}>
                                            <th>{index + 1}</th>
                                            <td>{article.title}</td>
                                            <td>
                                                {new Date(article.createdAt).toDateString()}
                                            </td>
                                            <td>
                                                <Button variant="primary" onClick={() => setModalShow(true)}>
                                                    <GrView />
                                                </Button>
                                                <EditorArticleView
                                                    show={modalShow}
                                                    onHide={() => setModalShow(false)}
                                                    article={article}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {article && <div className='col-md-3'>
                            {/* Status*/}
                            <div className="card status">
                                <div className="card-title">
                                    <h5>Status</h5>
                                </div>
                                <div className="card-body d-flex flex-column justify-content-around">
                                    <form onSubmit={handleSubmitStatus}>
                                        <select name="status" id="status" className="form-select" value={article ? article.status : "select-status"} onChange={statusChange}>
                                            <option value="select-status" disabled>Select Status</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="pending for review">Pending For Review</option>
                                            {/* <option value="reviewed">Reviewed</option> */}
                                        </select>
                                        <input
                                            type="submit"
                                            value="Submit"
                                            className="btn btn-dark btn-lg w-100 mt-3"
                                        />
                                    </form>
                                </div>
                            </div>
                            {/* Reviewer list */}
                            {article.reviewers.length < 3 && <form className="card reviewer-list mt-2" id="submit">
                                <div className="card-title">
                                    <h5>Reviewers</h5>
                                </div>
                                <div className="card-body p-0">
                                    <div
                                        className="search-author"
                                        style={{ marginBottom: ".2rem" }}
                                    >
                                        <input
                                            type="search"
                                            name="author-search"
                                            id="author-search"
                                            placeholder="Search Reviewer..."
                                            className="form-control"
                                            value={search}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                    <ul className="p-2">
                                        {reviewers.map((reviewer, index) => (
                                            <label htmlFor={reviewer._id} className="w-100" key={index}>
                                                <li className="m-0 d-flex justify-content-between align-items-center author-items">
                                                    <label htmlFor={reviewer._id}>{reviewer.firstName} {reviewer.lastName} ({reviewer.affiliation})</label>
                                                    <input
                                                        type="checkbox"
                                                        name="check-author"
                                                        id={reviewer._id}
                                                        className="bg-none check-author-inp"
                                                        onChange={handleSelectReviewer}
                                                    // checked={selectedReviewers.includes(reviewer.email)}
                                                    />
                                                </li>
                                            </label>
                                        ))}
                                    </ul>
                                </div>
                                <input
                                    type="submit"
                                    value="Submit"
                                    className="btn btn-dark my-2 mx-2"
                                    id="submit"
                                    // name="add user"
                                    onClick={handleSubmitReviewer}
                                />

                            </form>}
                        </div>}
                    </div>
                </div>
                {/* end editor-form here */}
            </div>
            {/* end container here */}
        </section>
    );
}

export default Editor;
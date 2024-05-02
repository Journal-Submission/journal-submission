import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { GrDocumentPdf } from 'react-icons/gr';
import PDFViewer from '../fileviewer/PDFViewer';
import 'bootstrap/dist/css/bootstrap.min.css';

function EditorArticleView(props) {
    const article = props.article;
    // console.log(article);
    const [modalShow, setModalShow] = useState(false);

    return (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            size="xl"
            aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    {article.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="table-responsive">
                    <table className='table table-bordered table-striped table-hover'>
                        <thead className='table-dark'>
                            <tr className='text-center'>
                                <th>Abstract</th>
                                <th>Keywords</th>
                                <th>Authors</th>
                                <th>View Article</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={1}>
                                <td>
                                    <div style={{ minWidth: "30rem" }}>
                                        {article.abstract}
                                    </div>
                                </td>
                                <td>
                                    {article.keywords.map((keyword, index) =>
                                        <div key={index} className='btn btn-success mx-1 my-1'>
                                            {keyword}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {article.authors.map((author, index) =>
                                        <div key={index}>
                                            {author.firstName} {author.lastName}
                                        </div>
                                    )}
                                </td>
                                <td className='text-center'>
                                    <Button variant="primary" onClick={() => setModalShow(true)}>
                                        <GrDocumentPdf />
                                    </Button>
                                    <PDFViewer
                                        show={modalShow}
                                        onHide={() => setModalShow(false)}
                                        fileurl={article.mergedScript}
                                        title={article.title}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditorArticleView;
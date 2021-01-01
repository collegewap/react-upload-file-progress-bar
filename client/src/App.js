import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import axiosInstance from "./utils/axios";

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progress, setProgress] = useState();
  const [error, setError] = useState();

  const submitHandler = (e) => {
    e.preventDefault(); //prevent the form from submitting
    let formData = new FormData();

    formData.append("file", selectedFiles[0]);
    //Clear the error message
    setError("");
    axiosInstance
      .post("/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (data) => {
          //Set the progress value to show the progress bar
          setProgress(Math.round((100 * data.loaded) / data.total));
        },
      })
      .catch((error) => {
        const { code } = error?.response?.data;
        switch (code) {
          case "FILE_MISSING":
            setError("Please select a file before uploading!");
            break;
          case "LIMIT_FILE_SIZE":
            setError("File size is too large. Please upload files below 1MB!");
            break;
          case "INVALID_TYPE":
            setError(
              "This file type is not supported! Only .png, .jpg and .jpeg files are allowed"
            );
            break;

          default:
            setError("Sorry! Something went wrong. Please try again later");
            break;
        }
      });
  };
  return (
    <Container>
      <Row>
        <Col lg={{ span: 4, offset: 3 }}>
          <Form
            action="http://localhost:8081/upload_file"
            method="post"
            encType="multipart/form-data"
            onSubmit={submitHandler}
          >
            <Form.Group>
              <Form.File
                id="exampleFormControlFile1"
                label="Select a File"
                name="file"
                onChange={(e) => {
                  setSelectedFiles(e.target.files);
                }}
              />
            </Form.Group>
            <Form.Group>
              <Button variant="info" type="submit">
                Upload
              </Button>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            {!error && progress && (
              <ProgressBar now={progress} label={`${progress}%`} />
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default App;

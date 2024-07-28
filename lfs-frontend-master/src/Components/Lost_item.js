import React, { useState } from "react";
import axios from "axios";
import lodash from "lodash";
import "bootstrap/dist/css/bootstrap.css";
import { useToasts } from "react-toast-notifications";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
function LostItem() {
  const [show, setShow] = useState(false);
  const { addToast } = useToasts();
  const token = window.localStorage.getItem("token");
  const [loading, setloading] = useState(false);
  const [itemname, setitemname] = useState("");
  const [description, setdescription] = useState("");
  const [itemquestion, setitemquestion] = useState("");
  const [itemimage, setitemimage] = useState([]);
  const [type, settype] = useState("");

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setloading(true);
    if (itemname && description && type) {
      const info = new FormData();
      info.append("name", itemname);
      info.append("description", description);
      info.append("question", itemquestion);
      info.append("type", type);
      // eslint-disable-next-line array-callback-return
      itemimage.map((itemImage) => {
        info.append("itemPictures", itemImage, itemImage.name);
      });

      axios({
        url: "http://localhost:8000/postitem",
        method: "POST",
        data: info,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        onUploadProgress: (ProgressEvent) => {
          console.log(
            "Upload progress: " +
              Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) +
              "%"
          );
        },
      })
        .then((response) => {
          console.log(response);
        })
        .then(() => {
          addToast("Wohoo 🤩! Item listed successfully.", {
            appearance: "success",
          });
          setitemname("");
          setdescription("");
          settype("");
          setitemquestion("");
          setitemimage([]);
          setloading(false);
          setShow(false);
        })
        .catch((err) => {
          setloading(false);
          console.log(err.Body);
          addToast("Oops 😞! Check internet connection or try again later.", {
            appearance: "error",
          });
        });
    } else {
      addToast("Did you missed any of the required fields 🙄?", {
        appearance: "error",
      });
    }
  };
  const temporaryShut = () => {
    addToast("New item listing has been disabled temporarily.", {
      appearance: "warning",
    });
    setShow(false);
  };
  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Post Item
      </Button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Post item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Item name<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item"
                value={itemname}
                onChange={(e) => setitemname(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Description<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Enter a question based on the item</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex:- What is the color of the phone ?"
                value={itemquestion}
                onChange={(e) => setitemquestion(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Item type<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="select"
                required={true}
                defaultValue="Choose..."
                onChange={(e) => settype(e.target.value)}
              >
                <option>Choose..</option>
                <option value={"Lost"}>Lost It</option>
                <option value={"Found"}>Found It</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.File
                type="file"
                id="formimage"
                label="Upload Image"
                onChange={(e) => {
                  // console.log(e.target.files)
                  let { files } = e.target;
                  lodash.forEach(files, (file) => {
                    // console.log(file);
                    setitemimage((item) => [...item, file]);
                  });
                }}
                multiple
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          {/* onClick={handleClose} */}
          <Button variant="primary" onClick={handleClose}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="sr-only">Loading...</span>
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LostItem;

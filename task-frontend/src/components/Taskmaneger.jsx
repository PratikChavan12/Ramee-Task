import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { deleteRecord, fetchRecords } from "../Utils/api";
import { ShimmerTable } from "react-shimmer-effects";
import { useNavigate } from "react-router-dom";
import { Modal, ModalFooter, ModalHeader, Button, ModalBody } from "reactstrap";
import { toast } from "react-toastify";

const Taskmaneger = () => {
  const [modal, setModal] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState();
  const [deleteRecordTitle, setDeleteRecordTitle] = useState();
  const toggle = () => setModal(!modal);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetching HR data
  const {
    data: recordList,
    isLoading: recordListLoading,
    isError: recordListError,
  } = useQuery({
    queryKey: ["get-record-list"],
    queryFn: () => fetchRecords(),
    staleTime: Infinity,
  });

  const {
    mutate: deleteRecMutation,
    isLoading: isRecDeleting,
    error: deleteError,
  } = useMutation({
    mutationKey: ["delete-record-by-Id"],
    mutationFn: (recordId) => deleteRecord({ id: recordId }),
    onSuccess: () => {
      toast.success("Record deleted successfully.");
      queryClient.invalidateQueries(["get-record-list"]);
      console.log("deleted successfully.");
      setModal(false);
    },
    onError: (error) => {
      toast.error(error?.message);
      console.log("Error deleting record:", error);
      setModal(false);
    },
  });

  const handleDelete = (id, title) => {
    setDeleteRecordId(id);
    setDeleteRecordTitle(title);
    toggle();
  };
  const DeleteRecordById = () => {
    deleteRecMutation(deleteRecordId);
  };

  return (
    <div className="container mt-5">
      {/* Header Controls */}
      <div className="d-flex justify-content-end align-items-center mb-3">
        <div>
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => navigate("/register")}
          >
            📝 Add Task
          </button>
        </div>
      </div>

      {recordListLoading ? (
        <ShimmerTable row={6} />
      ) : recordListError ? (
        <div className="text-center fs-2 text-danger fw-bold p-3 mt-5 pt-5">
          Something Went Wrong!{" "}
          <span className="text-primary">Try Again Later.</span>
        </div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-light text-center">
            <tr>
              <th>Sr No</th>
              <th>Title</th>
              <th>Staff</th>
              <th>Priority</th>
              <th>Type</th>
              <th>Due Date</th>
              <th>Entity</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {recordList?.data.map((task, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{task?.title}</td>
                <td>{task?.staff}</td>
                <td>
                  {task?.priority === "medium"
                    ? "Medium"
                    : task?.priority === "high"
                    ? "High"
                    : task?.priority === "low"
                    ? "Low"
                    : ""}
                </td>
                <td>{task?.type}</td>
                <td>{task?.duedate}</td>
                <td>{task?.entity}</td>
                <td>{task?.description}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() =>
                      navigate(`/register?type=edit&id=${task?.id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(task?.id, task?.title)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Delete Record</ModalHeader>
        <ModalBody>
          Are you want to delete the{" "}
          <span className="fw-bold">{deleteRecordTitle || ""}</span> record?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={DeleteRecordById}>
            Yes, I Delete
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Taskmaneger;

import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchRecords } from "../Utils/api";
import { Button, Spinner } from "reactstrap";

const RecordForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    type: "",
    duedate: "",
    entity: "",
    staff: "",
    file: null,
  });

  // Fetching HR data
  const {
    data: recordList,
    isLoading: recordListLoading,
    isError: recordListError,
  } = useQuery({
    queryKey: ["get-record-by-id", id],
    queryFn: () => fetchRecords({ id: id }),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (type) {
      setFormData(() => ({
        ...formData,
        title: recordList?.data?.title || "",
        description: recordList?.data?.description || "",
        priority: recordList?.data?.priority || "",
        type: recordList?.data?.type || "",
        duedate: recordList?.data?.duedate || "",
        entity: recordList?.data?.entity || "",
        staff: recordList?.data?.staff || "",
      }));
    }
  }, [type, recordListLoading, recordList]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "low",
      type: "",
      duedate: "",
      entity: "",
      staff: "",
    });
  };
  const [loading, setLoading] = useState(false);

  const onFormSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    const { title, description, priority, type, duedate, entity, staff } =
      formData;
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", title);
      payload.append("description", description);
      payload.append(
        "priority",
        priority === "High" ? "high" : priority === "Medium" ? "medium" : "low"
      );
      payload.append("type", type);
      payload.append("duedate", duedate);
      payload.append("entity", entity);
      payload.append("staff", staff);
      const recordData = await fetch(`http://127.0.0.1:8000/api/tasks/create`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: payload,
      });
      const recInfo = await recordData.json();
      if (recInfo && recInfo.success === true) {
        const submittedData = recInfo?.data;
        toast.success(`${submittedData?.title} Record Added Successfully`);
        resetForm();
        queryClient.invalidateQueries(["get-record-list"]);
        navigate("/record-list");
      } else {
        toast.error(recInfo?.message);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onEditFormSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    const { title, description, priority, type, duedate, entity, staff } =
      formData;
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("id", id);
      payload.append("title", title);
      payload.append("description", description);
      payload.append(
        "priority",
        priority === "High" ? "high" : priority === "Medium" ? "medium" : "low"
      );
      payload.append("type", type);
      payload.append("duedate", duedate);
      payload.append("entity", entity);
      payload.append("staff", staff);
      const recordData = await fetch(`http://127.0.0.1:8000/api/tasks/update`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: payload,
      });
      const recInfo = await recordData.json();
      if (recInfo && recInfo.success === true) {
        const submittedData = recInfo?.data;
        toast.success(`${submittedData?.title} Record Added Successfully`);
        resetForm();
        queryClient.invalidateQueries(["get-record-list"]);
        navigate("/record-list");
      } else {
        toast.error(recInfo?.message);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="px-5 py-4 bg-white shadow rounded w-50 mx-auto"
        style={{ marginTop: "55px" }}
      >
        <h2 className="mb-4 text-center text-primary">
          📝 {type ? "Update" : "Add"}{" "}
          <span className="text-secondary">
            {type && recordList?.data?.title
              ? recordList.data.title.length > 8
                ? recordList.data.title.substring(0, 8) + "..."
                : recordList.data.title
              : ""}
          </span>{" "}
          Record
        </h2>
        <form onSubmit={type ? onEditFormSubmit : onFormSubmit}>
          <div className="row mb-3">
            {/* Title */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="title"
                required
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>

            {/* Staff */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Assign to Staff</label>
              <select
                className="form-select"
                style={{ cursor: "pointer" }}
                name="staff"
                value={formData.staff}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    staff: e.target.value,
                  }))
                }
              >
                <option value="">-- Select Staff --</option>
                <option>Bruce</option>
                <option>Scarlet</option>
                <option>John</option>
              </select>
            </div>
          </div>

          {/* Priority, Type */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Priority <span className="text-danger">*</span>
              </label>
              <div className="p-2 rounded border">
                {["low", "medium", "high"].map((p) => (
                  <div
                    className="form-check form-check-inline mx-3"
                    key={p}
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      id={`priority-${p}`}
                      className="form-check-input"
                      style={{ cursor: "pointer" }}
                      type="radio"
                      name="priority"
                      value={p}
                      checked={formData.priority === p}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }))
                      }
                    />
                    <label
                      htmlFor={`priority-${p}`}
                      className="form-check-label text-capitalize"
                      style={{ cursor: "pointer" }}
                    >
                      {p}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Type <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                style={{ cursor: "pointer" }}
                name="type"
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
              >
                <option value="">-- Select Type --</option>
                <option value="Bug">Bug</option>
                <option value="Feature">Feature</option>
                <option value="Improvement">Improvement</option>
              </select>
            </div>
          </div>

          {/* Organization and Staff */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Govt. Organization / Entity
              </label>
              <select
                className="form-select"
                style={{ cursor: "pointer" }}
                name="organization"
                value={formData.entity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    entity: e.target.value,
                  }))
                }
              >
                <option value="">-- Select Organization --</option>
                <option>Org A</option>
                <option>Org B</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Due Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                style={{ cursor: "pointer" }}
                className="form-control"
                name="dueDate"
                required
                value={formData.duedate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    duedate: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              name="description"
              rows="4"
              required
              placeholder="Provide task details"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          {/* Submit Button */}
          <div className="d-flex justify-content-center">
            <button
              type="submit"
              className="btn btn-primary px-5"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RecordForm;

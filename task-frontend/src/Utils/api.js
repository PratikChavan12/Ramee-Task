// HR Records Fetching API
export const fetchRecords = async (value) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/get-tasks`, {
      method: "POST", // <-- Needs to be POST
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: value?.id || "", // <-- Match backend key name (hrId)
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

export const deleteRecord = async ({ id = "" }) => {
  const payload = new FormData();
  payload.append("id", id);
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: payload,
  };
  const response = await fetch(
    `http://127.0.0.1:8000/api/tasks/delete`,
    requestOptions
  );

  if (!response.ok) {
    const errorInfo = await response.json();
    const error = new Error("An Error occured while deleting the record");
    error.info = errorInfo;
    error.code = response.status;

    throw error;
  }
  return await response.json();
};

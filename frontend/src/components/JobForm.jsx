import { useState } from "react";
import API from "../services/api";

function JobForm() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitJob = async (e) => {
    e.preventDefault();

    try {
      await API.post("/jobs", form);

      setForm({
        title: "",
        company: "",
        location: "",
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="job-form" onSubmit={submitJob}>
      <h2>Add New Job</h2>

      <input
        name="title"
        placeholder="Job Title"
        value={form.title}
        onChange={handleChange}
      />

      <input
        name="company"
        placeholder="Company"
        value={form.company}
        onChange={handleChange}
      />

      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
      />

      <button type="submit">Add Job</button>
    </form>
  );
}

export default JobForm;
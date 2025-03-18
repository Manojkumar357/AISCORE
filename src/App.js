import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./App.css";

function App() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    fetch("http://localhost:5000/leads")
      .then((res) => res.json())
      .then((data) => setLeads(data));
  };

  const handleSubmit = (values, { resetForm }) => {
    fetch("http://localhost:5000/add-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then(() => {
        resetForm();
        fetchLeads();
      });
  };

  const handleDelete = (email) => {
    fetch(`http://localhost:5000/delete-lead/${email}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchLeads());
  };

  const handleReset = () => {
    fetch("http://localhost:5000/reset-leads", { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setLeads([]));
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    message: Yup.string()
      .min(5, "Message must be at least 5 characters")
      .required("Message is required"),
  });

  return (
    <div className="App">
      <h1>AI Lead Manager</h1>
      <Formik
        initialValues={{ name: "", email: "", message: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="text" name="name" placeholder="Name" />
            <ErrorMessage name="name" component="div" className="error" />

            <Field type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" className="error" />

            <Field as="textarea" name="message" placeholder="Message" />
            <ErrorMessage name="message" component="div" className="error" />

            <button type="submit" disabled={isSubmitting}>
              Add Lead
            </button>
          </Form>
        )}
      </Formik>

      <h2>Leads</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, idx) => (
            <tr key={idx}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.message}</td>
              <td>{lead.score}</td>
              <td>
                <button onClick={() => handleDelete(lead.email)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleReset}>Reset All</button>
    </div>
  );
}

export default App;

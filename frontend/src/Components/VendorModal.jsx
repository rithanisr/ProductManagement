import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const VendorModal = ({ show, onHide, vendorForm, savingVendor, handleVendorChange, handleVendorSubmit }) => (
  <Modal show={show} onHide={onHide} centered>
    <Form onSubmit={handleVendorSubmit} autoComplete="off">
      <Modal.Header closeButton>
        <Modal.Title>Add Vendor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="vendorName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={vendorForm.name}
            onChange={handleVendorChange}
            required
            autoFocus
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="vendorEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={vendorForm.email}
            onChange={handleVendorChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="vendorPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={vendorForm.password}
            onChange={handleVendorChange}
            minLength={6}
            required
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} type="button">
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={savingVendor}>
          {savingVendor ? "Creating vendor..." : "Create Vendor"}
        </Button>
      </Modal.Footer>
    </Form>
  </Modal>
);

export default VendorModal;

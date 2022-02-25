import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/index.css";

import { v4 as uuidv4 } from "uuid";

const contactsDataKey = "address-book";

function getContacts() {
	const contacts = typeof window !== 'undefined' && localStorage.getItem(contactsDataKey);
	return contacts ? JSON.parse(contacts) : dummyData;
}

const dummyData = [
	{
		id: 1,
		name: "name1",
		address: "address1",
		phoneNumber: "123123123"
	},
	{
		id: 2,
		name: "name2",
		address: "address2",
		phoneNumber: "123123123"
	},
	{
		id: 3,
		name: "name3",
		address: "address3",
		phoneNumber: "123123123"
	}
];

export default function IndexPage() {
	const [contacts, setContacts] = useState(getContacts());
	const [contactEditing, setContactEditing] = useState(null);
	const [newContact, setNewContact] = useState(null);
	const addNameInput = useRef();

	useEffect(() => {
		typeof window !== 'undefined' && localStorage.setItem(contactsDataKey, JSON.stringify(contacts));
	}, [contacts]);

	function deleteContact(id) {
		const newContacts = contacts.filter(contact => contact.id !== id);
		setContacts(newContacts);
	}

	function saveContact(e) {
		e.preventDefault();

		setContacts(
			contacts.map(contact => contact.id === contactEditing.id ?
				{
					...contact,
					name: contactEditing.name,
					address: contactEditing.address,
					phoneNumber: contactEditing.phoneNumber
				} :
				contact
			)
		);

		setContactEditing(null);
	}

	function addContact(e) {
		e.preventDefault();
		setContacts([...contacts, newContact]);
		setNewContact({ id: uuidv4(), name: "", address: "", phoneNumber: "" });
		addNameInput.current.focus();
	}

	return (
		<main className="container">
			<h2 className="text-center bg-primary mt-4 mb-5">Address Book</h2>
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h3 className="m-0">Contacts</h3>
				<div>
					<button type="button" className="btn btn-primary me-2" onClick={() => setNewContact({ id: uuidv4(), name: "", address: "", phoneNumber: "" })}>New Contact</button>
					<button type="button" className="btn btn-danger" onClick={() => {
						typeof window !== 'undefined' && localStorage.removeItem(contactsDataKey);
						setContacts(dummyData);
					}}>RESET</button>
				</div>
			</div>
			<div className="table-responsive">
				<table className="table">
					<thead>
						<tr>
							<th scope="col">Name</th>
							<th scope="col">Address</th>
							<th scope="col">Phone</th>
							<th scope="col">Actions</th>
						</tr>
					</thead>
					<tbody>

						{
							contacts.map(contact => (
								<tr key={contact.id}>
									<td>{contact.name}</td>
									<td>{contact.address}</td>
									<td>{contact.phoneNumber}</td>
									<td className="text-nowrap">
										<button type="button" className="btn btn-warning me-3" onClick={() => setContactEditing(contact)}>Edit</button>
										<button type="button" className="btn btn-danger" onClick={() => deleteContact(contact.id)}>Delete</button>
									</td>
								</tr>
							))
						}

					</tbody>
				</table>
			</div>

			{
				contactEditing
				&&
				<div className="overlay">
					<div className="edit-contact flex-grow-1">
						<div className="text-end">
							<button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setContactEditing(null)}></button>
						</div>
						<form onSubmit={saveContact}>
							<div className="mb-3">
								<label htmlFor="editName" className="form-label text-light">Name*</label>
								<input type="text" className="form-control" id="editName" value={contactEditing.name} onChange={e => setContactEditing({ ...contactEditing, name: e.target.value })} required autoFocus />
							</div>
							<div className="mb-3">
								<label htmlFor="editAddress" className="form-label text-light">Address</label>
								<input type="text" className="form-control" id="editAddress" value={contactEditing.address} onChange={e => setContactEditing({ ...contactEditing, address: e.target.value })} />
							</div>
							<div className="mb-3">
								<label htmlFor="editPhone" className="form-label text-light">Phone</label>
								<input type="number" className="form-control" id="editPhone" value={contactEditing.phoneNumber} onChange={e => setContactEditing({ ...contactEditing, phoneNumber: e.target.value })} />
							</div>
							<button type="submit" className="btn btn-primary">Save</button>
						</form>
					</div>
				</div>
			}

			{
				newContact
				&&
				<div className="overlay">
					<div className="add-contact flex-grow-1">
						<div className="text-end">
							<button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setNewContact(false)}></button>
						</div>
						<form onSubmit={addContact}>
							<div className="mb-3">
								<label htmlFor="addName" className="form-label text-light">Name*</label>
								<input ref={addNameInput} type="text" className="form-control" id="addName" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} autoFocus required />
							</div>
							<div className="mb-3">
								<label htmlFor="addAddress" className="form-label text-light">Address</label>
								<input type="text" className="form-control" id="addAddress" value={newContact.address} onChange={e => setNewContact({ ...newContact, address: e.target.value })} />
							</div>
							<div className="mb-3">
								<label htmlFor="addPhone" className="form-label text-light">Phone</label>
								<input type="number" className="form-control" id="addPhone" value={newContact.phoneNumber} onChange={e => setNewContact({ ...newContact, phoneNumber: e.target.value })} />
							</div>
							<button type="submit" className="btn btn-primary">Add</button>
						</form>
					</div>
				</div>
			}


		</main >
	);
}
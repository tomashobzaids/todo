import { db } from '$lib/utils/misc/firebase';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { get } from 'svelte/store';
import { modal, popups, savedTodos, todos } from './stores';
import type { TodoList } from '$lib/interfaces/todoList';

/** Shows a popup by pushing new popup to the array of popups. */
export function popup(label: string, color: 'good' | 'bad') {
	popups.update((x) => [...x, { label, color }]);
}

/** Closes a popup by it's index in the array of popups. */
export function closePopup(index: number) {
	popups.update((x) => x.filter((x, i) => i != index));
}

/** Loads the `id`s of saved TODOs from the local storage. */
export function loadSavedTodos() {
	savedTodos.set(JSON.parse(localStorage.getItem('todos')));
}

/** Saves a TODO `id` to the local storage. */
export function saveTodo(todoId: string) {
	const $savedTodos = get(savedTodos) || [];

	localStorage.setItem('todos', JSON.stringify([...$savedTodos, todoId]));
	loadSavedTodos();
}

/** Opens a modal for a set TODO `id`. */
export function openModal(todoId: string) {
	modal.set(todoId);
}

/** Checks if the TODO exists in Firestore. If yes, saves the TODO `id`. */
export function addTodo(todoId: string) {
	// TODO fetch todo data
	console.log('add todo');

	// if TODO was found in Firestore
	saveTodo(todoId);
}

/** Creates a new TODO instance in database with set `title`. */
export async function createTodo(title: string) {
	console.log(title);

	const ref = await addDoc(collection(db, 'todos'), {
		title: title
	});

	saveTodo(ref.id);
}

/**
 * Fetch and return data of a todo list specified by it's ID.
 * @param id The ID of the todo list.
 */
export async function fetchTodoListData(id: string): Promise<TodoList> {
	const data = await getDoc(doc(db, `todos/${id}`)).then((snap) => snap.data());

	return {
		id,
		done: data.done,
		title: data.title,
		list: data.list || []
	};
}

export async function updateTodoListData(id: string, data: Partial<TodoList>) {
	await updateDoc(doc(db, `todos/${id}`), data);
}
